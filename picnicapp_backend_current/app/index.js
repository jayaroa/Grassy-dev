const express = require('express');
const v1 = require('./release/v1/config/route');

const router = express.Router();

// For API version 1

router.use('/v1',v1)

module.exports = router