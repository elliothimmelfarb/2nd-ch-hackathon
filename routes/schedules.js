'use strict';

var express = require('express');
var router = express.Router();
var Schedule = require('../models/schedule');


router.route('/')
  .get((req, res) => Schedule.find({}, res.handle))



.post((req, res) => {
  req.body.emails = ['jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', ]
  Schedule.generate(req.body.emails, 7);
  res.send();
})



.delete((req, res) => Schedule.remove({}, res.handle));


// router.put('/generate', (req, res) => {
//   req.body.weeks = 7;
//   console.log(req.body.emails, req.body.weeks)
//   Schedule.generateSchedule(req.body.emails, req.body.weeks);
//   res.send();
// })

router.route('/:id')
  .get((req, res) => Schedule.findById(req.params.id, res.handle))
  .delete((req, res) => Schedule.findByIdAndRemove(req.params.id, res.handle))
  .put((req, res) => Schedule.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, res.handle));


module.exports = router;
