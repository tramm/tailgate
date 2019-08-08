/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('./models/User');
const jwtSecret = require('./jwtConfig');
const jwt = require('jsonwebtoken');
const sms = require('./ext/sms');
const OTP = require('./ext/otp');

const BCRYPT_SALT_ROUNDS = 12;
require('dotenv').config();
const STATIC_HOST = process.env.STATIC_WEB_HOST;

function auth_pass({ server }) {

  passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'mobile',
        passwordField: 'pin',
        passReqToCallback: true,
        session: false,
      },
      (req, mobile, pin, done) => {
        console.log(mobile);
        console.log(req.body.email);
        try {
          User.findOne({
            mobile: mobile
          }).then((user) => {
            if (user != null) {
              console.log('mobile already taken');
              return done(null, false, {
                message: 'mobile already taken',
              });
            }
            //check if pin and repin are same 
            if (pin != req.body.repin) {
              return done(null, false, {
                message: 'pin and confirm pin do not match',
              });
            }
            bcrypt.hash(pin, BCRYPT_SALT_ROUNDS).then((hashedPassword) => {
              User.add({
                mobile,
                pin: hashedPassword,
                email: req.body.email,
              }).then((user) => {
                console.log('user created');
                return done(null, user);
              });
            });
          });
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'mobile',
        passwordField: 'pin',
      },
      (mobile, pin, done) => {
        try {
          console.log("Hello from passport login");
          console.log("mobile and pin : " + mobile + pin);
          User.findOne({
            mobile: mobile
          }).then((user) => {
            if (user === null) {
              return done(null, false, { message: 'bad username' });
            }
            bcrypt.compare(pin, user.pin).then((response) => {
              if (response !== true) {
                console.log('pins do not match');
                return done(null, false, { message: 'pins do not match' });
              }
              console.log('user found & authenticated');
              return done(null, user);
            });
          });
        } catch (err) {
          done(err);
        }
      },
    ),
  );

  const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: jwtSecret.secret,
  };

  passport.use(
    'jwt',
    new JWTstrategy(opts, async (jwt_payload, done) => {
      try {
        console.log("the user id is " + jwt_payload.id);
        const user = await User.findById(jwt_payload.id);
        if (user) {
          console.log('user found in db in passport');
          done(null, user);
        } else {
          console.log('user not found in db');
          done(null, false);
        }
      } catch (err) {
        done(err);
      }
    }),
  );
  server.post('/register', (req, res, next) => {
    console.log("Doing Registration");
    passport.authenticate('register', (err, user, info) => {
      console.log("HALOOOOO");
      if (err) {
        console.error(`error ${err}`);
      }
      if (info !== undefined) {
        console.error(info.message);
        if (info.message === 'bad username') {
          res.status(401).send({ "error": info.message });
        } else {
          res.status(403).send({ "error": info.message });
        }
      } else {
        const token = jwt.sign({ id: user.id }, jwtSecret.secret);
        res.status(200).send({
          auth: true,
          token,
          message: 'user registered & logged in',
        });
        console.log("Successful Login");
      }
    })(req, res, next);
  });
  passport.serializeUser(function (user, cb) {
    console.log("Serializing User", user)
    cb(null, user.id);
  });

  passport.deserializeUser(function (id, cb) {
    console.log("DeSerializing User", id)
    User.findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

  server.use(passport.initialize());
  server.use(passport.session());
  server.post('/login',
    passport.authenticate('local'),
    (req, res, next) => {
      const token = jwt.sign({ id: req.user.id }, jwtSecret.secret);
      res.status(200).send({
        auth: true,
        token,
        message: 'user found & logged in',
      });
      console.log("Successful Login");
    });
  server.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });
  server.post('/otp_verify', async (req, res, next) => {
    valid = await OTP.validate({ token: req.body.token, secret: req.body.secret })
    console.log("speakeasy response - ", valid);
    if (!valid) {
      res.status(401).send({
        message: "Bad OTP try again"
      });
    } else {
      res.status(200).send({
        message: 'OTP Verified',
      });
      console.log("Successful OTP verification");
    }

  });
  server.post('/verify', async (req, res, next) => {
    console.log("Doing Verification");
    const user = await User.findOne({ mobile: req.body.mobile }).lean();
    if (user === null) {
      let secret = await OTP.generate_secret();
      let otp_val = await OTP.generate_otp(secret);
      console.log(otp_val);
      otp_message = " Thanks for downloading Book a service app please use OTP " + otp_val.token;
      log_message = "Sent Message to " + req.body.mobile
      sms(req.body.mobile, otp_message.replace(/ /g, "%20"));
      res.status(200).send({
        auth: false,
        error: "User Not in System",
        key: secret
      });
    } else {
      res.status(200).send({
        auth: true,
        message: 'mobile present in DB',
      });
      console.log("Successful Login");
    }
  });
};
module.exports = auth_pass;
