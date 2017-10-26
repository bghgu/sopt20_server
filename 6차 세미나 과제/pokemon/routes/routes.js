const express = require('express');
const router = express.Router();

const pokemon = require('./pokemon');
router.use('/pokemon', pokemon);

module.exports = router;
