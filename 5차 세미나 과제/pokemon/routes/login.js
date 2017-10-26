const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const async = require('async');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require('./dbConfig');

router.get('/', function(req, res) {
  fs.readFile('views/login.ejs', 'utf-8', function(err, result) {
    if (err)
      console.log("reading ehs error", err);
    else {
      res.status(200).send(ejs.render(result));
    }
  });
});

router.post('/', function(req, res) {
  let query1 = 'select * from trainer where email = ?';

  const task_login = [
    function(callback) {
      pool.getConnection(function(err, connection) {
        if (err) {
          console.log("getConnection error : ", err);
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
          if (data.length === 0) {
            res.status(201).send("존재하지 않는 사용자 계정입니다.");
            connection.release();
          } else {
            callback(null, data, connection);
          }
        }
      });
    },
    function(data, connection, callback) {
      bcrypt.compare(req.body.password, data[0].password, function(err, result) {
        if (err) {
          console.log(err);
          connection.release();
          callback(err, null);
        } else {
          if (result) {
            res.redirect('pokemon/' + data[0].id);
            connection.release();
          } else {
            res.status(201).send("비밀번호가 틀렸습니다.");
            connection.release();
          }
        }
      });
    }
  ];

  async.waterfall(task_login, function(err, result) {
    if (err)
      console.log(err);
    else
      console.log(result);
    }
  );

});

module.exports = router;
