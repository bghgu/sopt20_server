const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const ejs = require('ejs'); //확장모듈
const Converter = require('csvtojson').Converter; //확장모듈
const json2csv = require('json2csv'); //확장모듈
const bcrypt = require('bcrypt'); //확장모듈
const saltRounds = 10;

var pokemon = []; //csv에 write될 배열

const server = http.createServer(function(req, res){
  var converter = new Converter({});

  if(req.method.toString()=="GET") {
    converter.fromFile('./dogam.csv', function(err, result) {
      if(err) {
        console.log('reading csv file error', err);
      }
      else {
        fs.readFile('./show.ejs', 'utf-8', function(err, result) {
          if(err) {
            console.log('reading ejs error');
          }
          else {
            res.writeHead(200, {
              'Content-Type' : 'text/html'
            });
            res.write(ejs.render(result, {array : pokemon}));
          }
        });
      }
    });
  }
  //(req.method.toString()=="post")
  else {
    var body = "";
    var parsed;
    req.on('data', function(chunk){ //post로 넘어온 querystring을 append합니다.
      body += chunk;
    });
    req.on('end', function(){ //appned가 완료된 body를 가지고 이 이벤트핸들러에서 작업합니다.
      parsed = querystring.parse(body);
      bcrypt.hash(parsed.password, saltRounds, function(err, hashed) {
        if(err) {
          console.log('Hashing error', err);
        }
        else {
          parsed.password = hashed;
          array.push(parsed);
          fs.writeFile('./dogam.csv', json2csv({data:array}), 'utf-8', function(error, data) {
            if(err) {
              console.log('writing csv error');
            }
            else {
              res.end('saved');
            }
          });
        }
      });
    });
  }
});

server.listen(3000, function() {
    console.log('Server running at http://127.0.0.1:3000');
});
