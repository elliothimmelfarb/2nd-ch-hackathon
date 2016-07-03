'use strict';

const express = require('express');
const router  = express.Router();
const Email   = require('../models/email');

router.get('/unsubscribe/:id', (req, res)=> {
  Email.unsubscribe(user, err => {
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

  Email.sendEmail(event, res.handle);
});

module.exports = router;
