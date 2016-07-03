'use strict';

var express = require('express');
var router = express.Router();
var Schedule = require('../models/schedule');


router.route('/')
  .get((req, res) => Schedule.find({}, res.handle))
  .delete((req, res) => Schedule.remove({}, res.handle))
  
.post((req, res) => {
  //req.body.emails = ['jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', 'jsndnsdf', ]
  Schedule.generate(req.body.emails, req.body.weeks, res.handle);

})

.delete((req, res) => Schedule.remove({}, res.handle));

router.route('/:id')
  .get((req, res) => Schedule.findById(req.params.id, res.handle))
  .delete((req, res) => Schedule.findByIdAndRemove(req.params.id, res.handle))
  .put((req, res) => Schedule.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, res.handle));

router.get('/unsubscribe/:id', (req, res)=> {
  Schedule.unsubscribe(user, err => {
    console.log('err: ', err);
    res.status(err ? 400: 200).send(err || 'Successfully unsubscribed.');
  });
});

router.post('/send', (req, res)=>{
  
  let event = {
    type        : req.body.type,
    email       : 'tobiah.rex@gmail.com',
    subscribed  : true,
    _id         : '23412354qweqwerqwerq2345'
  };

  Schedule.sendEmail(event, res.handle);
});

module.exports = router;
