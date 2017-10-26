const express = require('express');
const http = require('http');
const app = express();
const Socket = require('socket.io');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/clint.html');
})

const http_server = http.createServer(app);

http_server.listen(3000, function() {
  console.log('3000번 포트에서 서버 구동중');
});

const io = new Socket(http_server);

io.on('connect', function(socket) {
  console.log('사용자가 접속했습니다.');

  socket.on('disconnect', function() {
    console.log('사용자가 나갔습니다.');
  });

  setInterval(function() {
    socket.emit('message', '서버에서 메세지를 보냅니다.');
  }, 1500);
});
