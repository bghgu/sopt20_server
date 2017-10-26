const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
aws.config.loadFromPath('../config/aws_config.json');
const s3 = new aws.S3();
const pool = require('../config/db_pool');
const multer = require('multer');
const multerS3 = require('multer-s3');
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'ektmf1993',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })
});

//저장된 모든 포켓몬 이름만 조회
router.get('/', function(req, res) {
    var query1 = 'select name from pokemon';
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log('getConnection err: ',err);
        }else {
            connection.query(query1, function(err, data){
                if(err) {
                    console.log('selecting query err: ',err);
                }
                else {
                    res.status(200).send(data);
                }
                connection.release();
            });
        }
    });
});
//특정 포켓몬의 모든 정보(이름, 특성, 이미지) 조회
router.get('/:id', function(req, res) {
    var query1 = 'select name, chara, image from pokemon where id = ?';
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log('getConnection err: ',err);
        }else {
            connection.query(query1, req.params.id, function(err, data){
                if(err) {
                    console.log('selecting query err: ',err);
                }
                else {
                    res.status(200).send(data);
                }
                connection.release();
            });
        }
    });
});
//새 포켓몬 저장
router.post('/', upload.single('image'), function(req, res) {
    var query1 = 'insert into pokemon(name, chara, image) values(?, ?, ?)';
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log('getConnection err: ',err);
        }else {
            var imageUrl;
            if(!req.file) {
                imageUrl = null;
            }else {
                imageUrl = req.file.location;
            }
            var record = {
                name: req.body.name,
                chara: req.body.charactor,
                image: imageUrl
            };
            connection.query(query1, [req.body.name, req.body.charactor, imageUrl], function(err, data){
                if(err) {
                    console.log('selecting query err: ',err);
                }
                else {
                    res.status(200).send(data);
                }
                connection.release();
            });
        }
    });
});
//파라미터로 들어온 id 값을 가진 포켓몬 정보 수정
router.put('/:id', function(req, res) {
    var query1 = 'update pokemon set name = ?, chara = ?, image = ? where id = ?';
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log('getConnection err: ',err);
        }else {
            connection.query(query1, [req.body.name, req.body.character, req.body.image, req.params.id], function(err, data){
                if(err) {
                    console.log('selecting query err: ',err);
                }
                else {
                    res.status(200).send(data);
                }
                connection.release();
            });
        }
    });
});
//파라미터로 들어온 id 값을 가진 포켓몬 정보 삭제
router.delete('/:id', function(req, res) {
    var query1 = 'delete from pokemon where id = ?';
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log('getConnection err: ',err);
        }else {
            connection.query(query1, req.params.id, function(err, data){
                if(err) {
                    console.log('selecting query err: ',err);
                    res.status(500).send({result : err});
                }
                else {
                    if(data.affectedRows !== 0) {
                        res.status(200).send({result: "delete success"});
                    }else {
                        res.status(404).send({result: "no data"});
                    }
                }
                connection.release();
            });
        }
    });
});

module.exports = router;
