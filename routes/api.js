'use strict';

const express = require('express');

const router = express.Router();

router.use('/emails', require('./emails'));

module.exports = router;
