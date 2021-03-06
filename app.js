'use strict';

const PORT = process.env.PORT || 8000;

const express = require('express');
const path = require('path');
const http = require('http');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

let mongoose = require('mongoose');

let mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/laundry';

mongoose.connect(mongoUrl, err => {
  console.log(err || `MongoDB connected to ${mongoUrl}`);
});

const app = express();
const server = http.createServer(app);

server.listen(PORT, err => {
  console.log(err || `Server listening on port ${PORT}`);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
<<<<<<< HEAD
app.use((req, res, next) => {
  res.handle = (err, data) => {
    res.status(err ? 400 : 200).send(err || data);
  }
  next();
})
=======
app.use((req, res, next)=>{
  res.handle = (err, dbData) => {
    res.status(err ? 400 : 200).send(err || dbData);
  }
  next();
});
>>>>>>> 383b34ef1b70b2c50eaf773b2f970d160b1bb0f5


///////// ROUTERS //////////////

app.use('/api', require('./routes/api'));

////////////////////////////////

app.get('/', (req, res) => {
  res.render('index');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});
