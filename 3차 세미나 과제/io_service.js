var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || 'localhost');
server.listen(app.get('port'), app.get('host'), function(){
  console.log("실시간 웹 채팅 서비스 구동중 " + app.get('port'));
});

var numUsers = 0;

io.on('connection', function (socket) { //클라);이언트가 커넥션 요청시 이벤트 처리
  var addedUser = false;
  socket.on('new message', function (data) {
    socket.broadcast.emit('new message', { //접속중인 모든 클라이언트에게 메세지 전송
      username: socket.username,
      message: data
    });
  });

  socket.on('add user', function (username) {
    if (addedUser) return;
    console.log(username+" 입장");

    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });

    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  socket.on('typing', function () { //사용자가 타이핑 중인 이벤트 처리
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  socket.on('stop typing', function () { //사용자가 타이핑을 중단하는 이벤트를 처리
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  socket.on('disconnect', function () { //서버와 클라이언트의 연결이 끊어지는 이벤트 처리
    if (addedUser) {
      --numUsers;
      console.log(socket.username+" 퇴장");
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
