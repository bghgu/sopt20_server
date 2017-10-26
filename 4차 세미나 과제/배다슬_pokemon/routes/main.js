const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const Converter = require('csvtojson').Converter;
const json2csv = require('json2csv');
const bodyParser = require('body-parser');
const async = require('async');
const querystring = require('querystring');
const bcrypt = require('bcrypt'); //확장모듈
const saltRounds = 10;
const multer = require('multer');
const upload = multer({dest: './pokemon'});

let array = [];

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', function(req, res, next) {
  let converter = new Converter({});
  converter.fromFile('csv/dogam.csv', function(error, result) {
    if (error)
      console.log(error);
    else {
      array = result;
      next();
    }
  });
});

router.get('/', function(req, res) {
  fs.readFile('views/show.ejs', 'utf-8', function(error, result) {
    res.status(200).send(ejs.render(result, {array: array}));
  });
});

router.post('/', function(req, res) {
  //async 함수
  const task_array2 = [
    function(callback) {
      //암호화
      bcrypt.hash(parsed.password, saltRounds, function(err, hash) {
        if (err)
          callback(err, null);
        else {
          //암호화
          parsed.password = hash;
          //배열 추가
          array.push(parsed);
          //csv에 데이터 입력
          callback(null, hash);
        }
      });
    },
    function(hash, callback) {
      fs.writeFile('csv/dogam.csv', json2csv({data: array}), 'utf-8', function(error, data) {
        if (error) {
          console.log("reading csv error", error);
        } else {
          res.writeHead(201, {
              'Content-Type': 'text/plain; charset = utf-8'
            });
            //저장 완료
            res.end('saved');
        }
      });
    }
  ];
  //post로 넘어온 값 저장
  parsed = req.body;
  //async 함수 호출
  async.waterfall(task_array2, function(err, result) {
    if (err) console.log(err);
    else console.log(result);
  });
});

module.exports = router;
