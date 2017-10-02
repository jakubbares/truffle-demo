var models  = require('../models/index');
var express = require('express');
var router  = express.Router();


router.get('/', function(req, res) {
  models.Car.findAll({
    include: [ models.Service ]
  }).then(function(cars) {
    res.send({
      message: 'Success',
      data: cars
    });
  });
});

router.post('/create', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  models.Car.create({
    address: req.body.address,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    vin: req.body.vin,
    spz: req.body.spz,
    brand: req.body.brand,
    model: req.body.model,
    category: req.body.category,
    isRegistered: req.body.isRegistered,
    distance: req.body.distance,
    dateRegistered: req.body.dateRegistered,
    value: req.body.value
  }).then(function() {
    res.send(JSON.stringify({
      message: 'Car registered',
      data: {
        address: req.body.address,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        vin: req.body.vin,
        spz: req.body.spz,
        brand: req.body.brand,
        model: req.body.model,
        category: req.body.category,
        isRegistered: req.body.isRegistered,
        distance: req.body.distance,
        dateRegistered: req.body.dateRegistered,
        value: req.body.value
      }
    }));
  });
});

router.put('/:vin/update', function(req, res) {
  const updateValues = {
    address: req.body.address,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    vin: req.body.vin,
    spz: req.body.spz,
    brand: req.body.brand,
    model: req.body.model,
    category: req.body.category,
    isRegistered: req.body.isRegistered,
    distance: req.body.distance,
    dateRegistered: req.body.dateRegistered,
    value: req.body.value
  };
  models.Car.update(updateValues, {
    where: {vin: req.params.vin}
  }).then(function(){
    res.send(JSON.stringify({
      message: 'Car updated',
      data: {
        address: req.body.address,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        vin: req.body.vin,
        spz: req.body.spz,
        brand: req.body.brand,
        model: req.body.model,
        category: req.body.category,
        isRegistered: req.body.isRegistered,
        distance: req.body.distance,
        dateRegistered: req.body.dateRegistered,
        value: req.body.value
      }
    }));
  });
});

// router.get('/:vin/destroy', function(req, res) {
//   models.Car.destroy({
//     where: {
//       vin: req.params.vin
//     }
//   }).then(function() {
//     res.send({
//       message: 'Car deleted'
//     });
//   });
// });



module.exports = router;
