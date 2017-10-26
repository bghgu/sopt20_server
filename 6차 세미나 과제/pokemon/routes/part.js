const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = express.Router();
aws.config.loadFromPath('./config/aws_config.json');
const pool = require('../config/db_pool');
const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'neosopt',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })
});

router.get('/', function(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) console.log('getConnection err: ', err);
        else {
            let query = 'select * from pokemon';
            connection.query(query, function(err, data) {
                if (err) console.log('selecting query err: ', err);
                else res.status(200).send({
                    result: data
                }); //5차 세미나까지는 ejs 템플릿으로 브라우저에 화면을 뿌려줬지만, 클라이언트가 앞으로 뷰를 담당하므로
                //서버에서는 이제부터 쿼리 결과를 json객체에 담아서 보내주도록 합니다.
                connection.release();
            });
        }
    });
});

router.post('/', upload.single('image'), function(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) console.log('getConnection err: ', err);
        else {
            let query = 'insert into pokemon set ?'; //placeholder에 들어갈 값으로 배열 대신에 제이슨 객체를 삽입할 수도 있습니다.
            let imageUrl;
            if (!req.file) imageUrl = null;
            else imageUrl = req.file.location;
            let record = {
                name: req.body.name,
                charactor: req.body.charactor,
                image: imageUrl
            };
            connection.query(query, record, function(err) {
                if (err) console.log('inserting query err:', err);
                else res.status(201).send({
                    message: 'save'
                }); //쿼리 결과는 항상 제이슨 객체에 담아서 응답합니다.
                connection.release();
            });
        }
    });
});

module.exports = router;
