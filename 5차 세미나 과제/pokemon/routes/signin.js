const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const async = require('async');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require('./dbConfig');

router.get('/', function(req, res) {
  fs.readFile('views/signin.ejs', 'utf-8', function(err, result) {
    if (err) console.log("reading ehs error", err);
    else {
      res.status(200).send(ejs.render(result));
    }
  });
});

router.post('/', function(req, res) {
  let query1 = 'select email from trainer where email = ?';
  let query2 = 'insert into trainer(name, password, email) values(?, ?, ?)';

  const task_signin = [
    function(callback) {
      pool.getConnection(function(err, connection) {
        if (err) {
          console.log("getConnection : ", err);
          callback(err, null);
        } else {
          callback(null, connection);
        }
      });
    },
    function(connection, callback) {
      connection.query(query1, req.body.email, function(err, data) {
        if (err) {
          console.log("query error : ", err);
          connection.release();
          callback(err, null);
        } else {
          if (data.length !== 0) {
            res.status(403).send("이미 존재하는 계정입니다.");
            connection.release();
          } else {
            callback(null, connection);
          }
        }
      });
    },
    function(connection, callback) {
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if (err) {
          console.log("hash error : ", err);
          callback(err, null);
        } else {
          callback(null, hash, connection);
        }
      });
    },
    function(hash, connection, callback) {
      connection.query(query2, [req.body.name, hash, req.body.email], function(err) {
        if (err) {
          console.log("insert error : ", err);
          connection.release();
          callback(err, null);
        } else {
          res.status(201).send("회원가입 완료");
          connection.release();
        }
      });
    }
  ];

  async.waterfall(task_signin, function(err, result) {
    if (err) console.log(err);
    else console.log(result);
  });

});

module.exports = router;
