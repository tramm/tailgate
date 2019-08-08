const express = require('express');
const _ = require('lodash');
const logger = require('../logs');
const router = express.Router();
const inventory = require('../models/inventory');

 

router.use((req, res, next) => {
  console.log("service api authenication ");
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
              console.log(req);
              console.log(info.message);
              res.status(403).send({ "error": info.message });
              return;
          }
          console.log(user);
          req.user = user;
          next();
      })(req, res, next);
  }
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
module.exports = router;
