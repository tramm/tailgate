const express = require('express');
const _ = require('lodash');
const logger = require('../logs');
const router = express.Router();
const inventory = require('../models/inventory');
const store = require('../ext/s3.js');
 

router.use((req, res, next) => {
  console.log("service api authenication ");
  next();
});

router.get('/inventory/stock', async (req, res) => {
    try {
      model = 'stock.picking';
      console.log("Hello from inventory stock api");
      let domain = [];
      let fields = ["name","origin","state"];
      let result = await sale.getInventoryStock(req.user, {model, domain: domain, fields: fields});
      console.log(model + '', result);
      res.json({result});
    } catch (err) {
      console.log(err);
      res.json({ error: err.message || err.toString() });
    }
  });
  router.get('/s3', async (req, res) => {
    try {
      let result = await store("../../dms/web/static/Saboo-02.png");
      console.log( result);
      res.json({result});
    } catch (err) {
      console.log(err);
      res.json({ error: err.message || err.toString() });
    }
  });
module.exports = router;
