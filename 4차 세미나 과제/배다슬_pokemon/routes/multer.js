const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const Converter = require('csvtojson').Converter;
const json2csv = require('json2csv');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest : './pokemon'});

router.get('/', function(req, res) {
  fs.readFile('views/image_upload.ejs', 'utf-8', function(error, result) {
    if(error) console.log(error);
    else res.status(200).send(result);
  });
});

router.post('/', upload.single('pic'), function(req, res) {
  res.status(201).send("저장 완료");
});

module.exports = router;
