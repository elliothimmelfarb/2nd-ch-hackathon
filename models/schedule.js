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
    address: {
      type: Boolean
    },
    subscribed: {
      type: String
    }
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

scheduleSchema.statics.generate = function(emails, weeks) {
  //console.log(emails, weeks);
  console.log("emails: ", emails, '\nweeks: ', weeks);
  let days = weeks * 7;
  var arrays = [];
  var people = shuffle(emails);
  var daysInCycle = 6;
  var remainder = daysInCycle % people.length;
  var groupSize = Math.floor(people.length / daysInCycle);
  var groupArray = (chunkify(people, daysInCycle));
  getCalendarEvents(groupArray);
  // console.log('calendarEvents:', calendarEvents);

  //shuffle input of people to randomize
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
  function getCalendarEvents(array) {
    var calendarEvents = [];

    let firstStart = moment().set({
      hour: 7,
      minute: 0,
      second: 0
    }).add(1, 'day');


    for (var index = 0; index < days; index++) {
      //satrt date plus dats
      //var day = moment().add(index, 'days')
      //repeatable index loop through people
      var currIndex = ((index + 1) % array.length + array.length) % array.length;


      var cycleTime = Math.floor(16 / groupArray[currIndex].length);
      // let now = new Date();
      // let year = now.getFullYear();
      // let month = now.getMonth() + 1;
      // let day = now.getDay() + 1;
      // let tomorrow = `${year}-${month}-${day} 07:00:00`
      // let startTime = moment(tomorrow).calendar();
      //start time = current day at 6:00am
      // var startTime = mom;



      for (var i = 0; i < groupArray[currIndex].length; i++) {
        // console.log("startTime", );
        let startTime = firstStart.clone();

        //startTime.add(cycleTime, 'hours')
        let endTime = startTime.add(cycleTime, 'hours').format();

        calendarEvents.push({ day: index, startTime: startTime.format(), endTime, email: groupArray[currIndex][i] })

        firstStart.add(cycleTime, 'hours');

        //cycleTime.add(cycleTime, 'hours')
        // cycleTime += cycleTime;
      }

    }
    console.log('calendarEvents:', calendarEvents)
    Schedule.create(calendarEvents, (err, something) => {
      console.log(err || something);
    });
  }
}

scheduleSchema.statics.create = (reqObj, cb) => {
  Schedule.create(reqObj, (err, newSchedule) => {
    if (err) return cb(err);
    Schedule.generate();
    // Schedule.find(newSchedule._id, (err, savedSchedule)=> {
    //   err ? cb(err) : cb(null, savedSchedule);
    // });
  });
};

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
