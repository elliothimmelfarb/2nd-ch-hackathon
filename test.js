const moment = require('moment');

let date = moment().format();
let date2 = moment(date).add(1, 'seconds').format();
let date3 = moment(date).add(2, 'seconds').format();

let count = 0;

while(date < date3) {
  date = moment().format();
  console.log(date, date2);
  for(var i=0; i<43483; i++) {
    let num = 123456789;
    num /= 987;
    num *= 987;
  }
  if (date === date2) {
    console.log('equal')
    break;
  }
  console.log('hi', count++);
}
