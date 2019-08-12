const express = require('express');
const _ = require('lodash');

const Event = require('../models/Event');
const logger = require('../logs');
const router = express.Router();
const passport = require('passport');

router.get('/events', async (req, res) => {
  try {
    const event = await Event.list();
    res.json(event);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/events/add', async (req, res) => {
  try {
    const event = await Event.add(req.body);
    res.json({ 
        success: true,
        message: "Successfully Added" 
    });
  } catch (err) {
    logger.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;

