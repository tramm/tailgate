const express = require('express');
const session = require('express-session');
const mongoSessionStore = require('connect-mongo');
const mongoose = require('mongoose');
const auth_pass = require('./passport');
const api = require('./api');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = process.env.MONGO_URL_TEST;

mongoose.connect(MONGO_URL, { useNewUrlParser: true });

const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://dev.api.turnright.tech';

const sessionSecret = process.env.SESSION_SECRET;


const URL_MAP = {
  '/login': '/public/login',
};

const server = express();
//server.use(express.json());

server.use(express.json({limit: '50mb'}));
server.use(express.urlencoded({limit: '50mb'}));

// confuring MongoDB session store
const MongoStore = mongoSessionStore(session);
const sess = {
  name: 'dms.sid',
  secret: sessionSecret,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 * 60, // save session 14 days
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000,
  },
};
//configuring the AWS environment
AWS.config.update({
  accessKeyId: process.env.Amazon_accessKeyId,
  secretAccessKey: process.env.Amazon_secretAccessKey
});

server.use(session(sess));
auth_pass({ server });
api(server);

  
// starting express server
server.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
});
