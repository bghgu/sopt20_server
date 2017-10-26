const express = require('express');
const router = express.Router();

const lists = require('./lists');
router.use('/lists', lists);

module.exports = router;
