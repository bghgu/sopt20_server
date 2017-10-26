var express = require('express');
var router = express.Router();

var index = require('./index');
router.get('/', index);

var main = require('./main');
router.use('/main', main);

var multer = require('./multer');
router.use('/multer', multer);

var pokemon = require('./pokemon');
router.use('/pokemon', pokemon);

module.exports = router;
