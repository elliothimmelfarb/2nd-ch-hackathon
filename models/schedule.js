'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId;

let scheduleSchema = new mongoose.Schema({
  day: {
    type: Number
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  email: {
    type: String
  },
  subscibed: {
    type: Boolean
  }
});

let emailsToBeSent = [];

let Schedule;

scheduleSchema.statics.checkToSeeIfPeopleNeedEmails = function() {
  Schedule.find({}, (err, events) => {
    let now = moment();
    let eventsArr = [];
    for (let i = 0; i < events.length; i++) {
      if (Math.abs(now.diff(moment(events.startTime))) < 300000) {
        let eventObj = { email: events[i].email, type: 'startTime' };
        eventsToBeSent.push(eventObj);
      }
      if (Math.abs(now.diff(moment(events.endTime))) < 300000) {
        let eventObj = { email: events[i].email, type: 'endTime' };
        eventsToBeSent.push(eventObj);
      }
    }
  })
}

scheduleSchema.statics.generate = function(emails, weeks, cb) {
  //console.log(emails, weeks);
  console.log("emails: ", emails, '\nweeks: ', weeks);
  let days = weeks * 7;
  var people = shuffle(emails);
  var daysInCycle = 6;

  //create evenly distributed arrays of people
  var remainder = daysInCycle % people.length;
  var groupSize = Math.floor(people.length / daysInCycle);
  var groupArray = (chunkify(people, daysInCycle));
  console.log("groups:", groupArray);
  //create array of calendar events
  var calendarEvents = getCalendarEvents(groupArray, days);
  //console.log("calendar Events: ", calendarEvents);

  Schedule.create(calendarEvents, (err, events) => {
   if(err) cb(err);
   console.log("Events -------- ", events);
   cb(null, events);
   /*Schedule.find({}, (err, events) =>{
      if(err) console.log(err);
     console.log("-------------events-------------:", events);
     cb(null, events);
    })*/
  });
}

/*scheduleSchema.statics.create = (reqObj, cb) => {
  console.log("reqObj: ", reqObj);
  Schedule.create(reqObj, (err, newSchedule) => {
    if (err) return cb(err);
    //Schedule.generate();
    // Schedule.find(newSchedule._id, (err, savedSchedule)=> {
    //   err ? cb(err) : cb(null, savedSchedule);
    // });
  });
};*/

function getCalendarEvents(array, days) {
  var calendarEvents = [];
  console.log("in cal events")

  let firstStart = moment().set({
    hour: 7,
    minute: 0,
    second: 0
  }).add(1, 'days');
  
  for (var index = 0; index < days; index++) {

    var currIndex = ((index + 1) % array.length + array.length) % array.length;
    var cycleTime = Math.floor(16/array[currIndex].length);

    // var endTime = firstStart.add(cycleTime, 'hours');
    //console.log("array[currIndex]:", array[currIndex]);
    var startTime = firstStart.clone();
    //console.log("\nstartTime for day ------: ", startTime.format('MMMM Do YYYY, h:mm:ss a'));
    for (var i = 0; i < array[currIndex].length; i++) {
      var endTime = startTime.clone();
      endTime.add(cycleTime, 'hours');
      //console.log("email?: ", array[currIndex][i]);
      //console.log("startTime", startTime.format('MMMM Do YYYY, h:mm:ss a'));
      //console.log("endTime", endTime.format('MMMM Do YYYY, h:mm:ss a'));
      calendarEvents.push({ day: index, startTime: startTime.format(), endTime: endTime.format(), email: array[currIndex][i] })
      startTime.add(cycleTime, 'hours');
    }
    firstStart.add(1, 'days');
    //console.log('firstStart after add:', firstStart.format('MMMM Do YYYY, h:mm:ss a'));
  }
  return calendarEvents;
}

function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}

  //Break people up into even groups
function chunkify(a, n) {
    if (n < 2) return [a];
    var len = a.length;
    var out = [];
    var i = 0;
    var size;
    if (len % n === 0) {
      size = Math.floor(len / n);
      while (i < len) {
        out.push(a.slice(i, i += size));
      }
    } else {
      while (i < len) {
        size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, i += size));
      }
    }
    return out;
}

  //Create calendar events based on number of people and days



scheduleSchema.statics.getOne = (reqId, cb) => {
  Schedule.findById(reqId, (err, dbSchedule) => {
    err ? cb(err) : cb(null, dbSchedule);
  });
};

scheduleSchema.statics.removeOne = (reqId, cb) => {
  Schedule.findByIdAndRemove(reqId, (err, oldSchedule) => {
    err ? cb(err) : cb(null, { SUCCESS: `Schedule: ${oldSchedule} has been removed.` });
  });
};

scheduleSchema.statics.updateOne = (editObj, cb) => {
  Schedule.findByIdAndUpdate(editObj.id, { $set: editObj.body }, (err, oldDbSchedule) => {
    if (err) return cb(err);
    Schedule.findById(oldDbSchedule._id, (err, savedSchedule) => {
      err ? cb(err) : cb(null, savedSchedule);
    });
  });
};

Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
