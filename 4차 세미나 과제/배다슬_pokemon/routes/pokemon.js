const fs = require('fs');
const ejs = require('ejs');
const express = require('express');
const router = express.Router();
const Converter = require('csvtojson').Converter;
const json2csv = require('json2csv');
const multer = require('multer');
//이미지를 로컬 디스크에 저장할 때 이미지 저장에 대한 옵션을 정할 수 있습니다.
const storage = multer.diskStorage({
  destination: function(req, file, cb){ //destination = 이미지를 저장할 경로
    cb(null, 'public/images'); //???????을 이미지가 저장될 위치로 바꿔주세요.
  },
  filename: function(req, file, cb){ //filename = 이미지 저장할 때 이름
    cb(null, file.originalname.split('.')[0]); //확장자를 뺀 이름으로 이미지를 저장합니다.
  }
});
const upload = multer({storage: storage}); //위의 storage를 프로퍼티 값으로 갖는 multer객체를 만듭니다.

let array = [];

router.get('/', function(req, res, next) {
  let converter = new Converter({});
  converter.fromFile('csv/pokemon.csv', function(error, result) {
    if (error)
      console.log(error);
    else {
      array = result;
      next();
    }
  });
});

router.get('/', function(req, res) {
  fs.readFile('views/pokemon.ejs', 'utf-8', function(error, result) {
    if(error) console.log(error);
    else res.status(200).send(ejs.render(result, {array: array}));
  });
});

router.post('/complete', upload.single('pic'), function(req, res) {
  array.push(req.body);
  fs.writeFile('csv/pokemon.csv', json2csv({data: array}), 'utf-8', function(error, data) {
    if (error) {
      console.log("reading csv error", error);
    } else {
      res.writeHead(201, {
          'Content-Type': 'text/plain; charset = utf-8'
        });
        //저장 완료
        res.end('저장완료');
    }
  });
});

module.exports = router;
