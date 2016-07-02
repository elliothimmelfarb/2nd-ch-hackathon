'use strict';

const express = require('express');

const router = express.Router();

router.use('/schedules', require('./schedules'));

module.exports = router;
