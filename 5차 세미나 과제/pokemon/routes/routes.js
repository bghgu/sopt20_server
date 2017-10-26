var express = require('express');
var router = express.Router();

var pokemon = require('./pokemon');
router.use('/pokemon', pokemon);

var signin = require('./signin');
router.use('/signin', signin);

var login = require('./login');
router.use('/login', login);

module.exports = router;
