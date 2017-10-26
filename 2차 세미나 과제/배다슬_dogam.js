const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const ejs = require('ejs'); //확장모듈
const Converter = require('csvtojson').Converter; //확장모듈
const json2csv = require('json2csv'); //확장모듈
const bcrypt = require('bcrypt'); //확장모듈
const saltRounds = 10;

var array = []; //csv에 write될 배열

const server = http.createServer(function(req, res) {
    var converter = new Converter({});
    let body = '';
    let parsed;

    converter.fromFile("./dogam.csv", function(err, result) {
        if (err) {
            console.log(err);
            //csv파일이 없을 경우 새로 생성
            fs.writeFile('./dogam.csv', json2csv({
                data: array,
                fields: ['name', 'charactor', 'weight', 'password']
            }), 'utf-8', function(error, data) {
              console.log('create csv file');
            });
        }
        //csv 파일 데이터 추가
        array = result;
    });

    req.on('data', function(chunk) { //post로 넘어온 querystring을 append합니다.
        body += chunk;
    });
    req.on('end', function() { //appned가 완료된 body를 가지고 이 이벤트핸들러에서 작업합니다.
      //ejs파일 출력
        if (body === "") {
            fs.readFile('./show.ejs', 'utf-8', function(err, show) {
                if (err)
                    console.log("reading file error\n", err);
                else {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.write(ejs.render(show, {
                        array: array,
                    }));
                    res.end();
                }
            });
        } else {
            //데이터 파싱
            parsed = querystring.parse(body);
            //입력된 값이 없을 경우
            if (parsed.name === '' || parsed.charactor === '' || parsed.weight === '' || parsed.password === '') {
                res.writeHead(201, {
                    'Content-Type': 'text/plain; charset = utf-8'
                });
                //데이터 없음
                res.end('no data');
            //입력된 값이 있을 경우
            } else {
                //암호화
                bcrypt.hash(parsed.password, saltRounds, function(err, hash) {
                    if (err)
                        console.log("Hashing error", err);
                    else {
                        //암호화
                        parsed.password = hash;
                        //배열 추가
                        array.push(parsed);
                        //csv에 데이터 입력
                        fs.writeFile('./dogam.csv', json2csv({
                            data: array
                        }), 'utf-8', function(error, data) {
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
                });
            }
        }
    });
});

server.listen(3000, function() {
    console.log('Server running at http://127.0.0.1:3000');
});
