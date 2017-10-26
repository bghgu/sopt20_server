const mysql = require('mysql');
const dbConfig = {
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'asas1212',
  database: 'pokemon',
  //pool 커넥션 개체는 10개
  connectionLimit: 10
};
const pool = mysql.createPool(dbConfig);

module.exports = pool;
