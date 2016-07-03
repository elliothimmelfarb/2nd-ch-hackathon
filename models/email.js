'use strict';

const mongoose = require('mongoose');
const Mail = require('./mail.js')

let emailSchema = mongoose.Schema({
  number : {
    type  : Number
  },
  email  : {
    type  : String
  },
  startTime : {
    type  :   String
  },
  finishTime : {
    type  :   String
  },
  subscribed : {
    type  :   Boolean
  }
});

emailSchema.statics.sendEmail = (userEvent, cb) => {
  if(!userEvent) return cb({ERROR : 'You did not provide the necessary details.'});

  if(userEvent.type === 'start') Mail.startLaundry(userEvent, response=> {
    if(response.statusCode !== 202) return cb(err);
    cb(null, {SUCCESS : 'Emails sent succcessfully.'});
  });

  if(userEvent.type === 'finish') Mail.finishLaundry(userEvent, response=>{
    if(response.statusCode !== 202) return cb(err);
    cb(null, {SUCCESS : 'Emails sent succcessfully.'});
  });
};

emailSchema.statics.unsubscribe = (userObj, cb) => {
  if(!userObj) return cb({ERROR : 'Did not provide needed info for unsubscribe.'});

  User.findById(userObj._id, (err, dbUser)=> {
    if(err || !dbUser) return cb(err || 'User not found');
    dbUser.subscribed = false;
    dbUser.save(cb);
  });
};

let Email = mongoose.model('Email', emailSchema);
module.exports = Email;
