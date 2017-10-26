const express = require('express');
const router = express.Router();
const moment = require('moment');
const now = moment(new Date()).format('YYYY-MM-DD, h:mm:ss a');
const aws = require('aws-sdk');
const async = require('async');
aws.config.loadFromPath('./config/aws_config.json');
const s3 = new aws.S3();
const pool = require('../config/db_pool');
const multer = require('multer');
const multerS3 = require('multer-s3');
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'ektmf1993',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })
});
//전체 게시글 조회
router.get('/', function(req, res) {
    const all_lists = [
        function(callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.log('getConnection error : ', err);
                    res.status(500).send({
                        message: 'selecting all posts error : ' + err,
                        result: ''
                    });
                    callback(err, null);
                } else {
                    callback(null, connection);
                }
            });
        },
        function(connection, callback) {
            var query = 'select * from board order by id desc;';
            connection.query(query, function(err, data) {
                if (err) {
                    console.log("query err", err);
                    res.status(503).send({
                        message: 'selecting all posts error : ' + err,
                        result: ''
                    });
                    callback(err, null);
                } else {
                    res.status(200).send({
                        message: 'ok',
                        result: data
                    });
                }
                connection.release();
            });
        }
    ];
    async.waterfall(all_lists, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
});

//특정 게시글 조회
router.get('/:id', function(req, res) {
    const lists = [
        function(callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.log('getConnection error : ', err);
                    res.status(500).send({
                        message: 'selecting all posts error : ' + err,
                        result: ''
                    });
                    callback(err, null);
                } else {
                    callback(null, connection);
                }
            });
        },
        function(connection, callback) {
            //1. 조회수 1 증가
            var query1 = 'update board set view_number = view_number + 1 where id = ?';
            connection.query(query1, req.params.id, function(err, data1) {
                if(err) {
                    console.log("query1 err", err);
                    callback(err, null);
                }else {
                    callback(null, connection, data1);
                }
            });
        },
        function(connection, data1, callback) {
            //2. 특정 게시글 조회
            var query2 = 'select * from board where id = ?';
            connection.query(query2, req.params.id, function(err, data2) {
                if(err) {
                    console.log("query2 err", err);
                    callback(err, null);
                }else {
                    callback(null, connection, data2);
                }
            });
        },
        function(connection, data2, callback) {
            //3. 특정 게시글의 댓글 조회
            var query3 = 'select * from comments where board_id = ?';
            connection.query(query3, req.params.id, function(err, data3) {
                if(err) {
                    console.log("query3 err", err);
                    callback(err, null);
                }else {
                    console.log(data3);
                    res.status(200).send({
                        message: 'ok',
                        result: {
                            post : data2,
                            comment : data3
                        }
                    });
                }
            });
            connection.release();
        }
    ];
    async.waterfall(lists, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
});
//게시글 작성
router.post('/', upload.single('image'), function(req, res) {
    console.log(req.body);
    const write = [
        function(callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.log('getConnection error : ', err);
                    res.status(500).send({
                        message: 'selecting all posts error : ' + err,
                        result: ''
                    });
                    callback(err, null);
                } else {
                    callback(null, connection);
                }
            });
        },
        function(connection, callback) {
            var query = 'insert into board(writer, title, written_time, content, image_url) values(?, ?, ?, ?, ?)';
            var imageUrl;
            if (!req.file) {
                imageUrl = null;
            } else {
                imageUrl = req.file.location;
            }
            connection.query(query, [req.body.writer, req.body.title, now, req.body.content, imageUrl], function(err, data) {
                if (err) {
                    console.log("error : ", err);
                    res.status(503).send({
                        message: 'selecting all posts error : ' + err,
                        result: ''
                    });
                    callback(err, null);
                } else {
                    res.status(201).send({
                        message: "ok"
                    });
                }
            });
            connection.release();
        }
    ];
    async.waterfall(write, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
});
//댓글 작성
router.post('/:id', upload.single(), function(req, res) {
    console.log(req.body);
    console.log(req.params);
    const write_comment = [
        function(callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.log('getConnection error : ', err);
                    res.status(500).send({
                        message: 'selecting all posts error : ' + err,
                        result: ''
                    });
                    callback(err, null);
                } else {
                    callback(null, connection);
                }
            });
        },
        function(connection, callback) {
            var query = 'insert into comments(board_id, writer, written_time, content) values(?, ?, ?, ?)';
            connection.query(query, [Number(req.params.id), req.body.writer, now, req.body.content], function(err, data) {
                if (err) {
                    console.log("query error : ", err);
                    res.status(503).send({
                        message: 'selecting all posts error : ' + err,
                        result: ''
                    });
                    callback(err, null);
                } else {
                    res.status(201).send({
                        message: "ok"
                    });
                }
            });
            connection.release();
        }
    ];
    async.waterfall(write_comment, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
});
module.exports = router;
