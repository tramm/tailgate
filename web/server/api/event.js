const express = require('express');
const _ = require('lodash');

const Event = require('../models/Event');
const base = require('../models/base');
const logger = require('../logs');
const router = express.Router();
const passport = require('passport');

router.use((req, res, next) => {
  console.log("service api authentication ");
  if (req.user) {
    next();
  } else {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.error(err);
        res.status(401).send("Unauthorized Access");
        return;
      }
      if (info !== undefined) {
        console.log(info.message);
        res.status(403).send({ "error": info.message });
        return;
      }
      req.user = user;
      next();
    })(req, res, next);
  }
});

router.get('/listEvents', async (req, res, next) => {
  try {
    const events = await Event.list(req.user);
    res.json(events);
  } catch (err) {
    next(err);
  }
});

router.post('/createEvents', async (req, res, next) => {
  try {
    const createdEvent = await Event.add(req.user, req.body);
    res.json(createdEvent);
  } catch (err) {
    next(err);
  }
});

router.get('/listLocations', async (req, res, next) => {
  try {
    console.log("Inside list locations api");
    const locations = await base.listLocations(req.user);
    res.json(locations);
  } catch (err) {
    //res.json({ error: err.message || err.toString() });
    next(err);
  }
});

/* middleware to handle errors (this should be present at the end of all api's always) */
router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
});

module.exports = router;

