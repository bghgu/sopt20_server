//TCP 소켓 통신
//server_net
const net = require('net');

const server = net.createServer(function(socket) {
  console.log('tcp 서버에 오신것을 환영합니다.');

  socket.write('서버에서 메세지를 보냅니다.');

  socket.on('data', function(data) {
    console.log('clint로 부터 오는 msg : ' + data.toString());
  });

  socket.on('end', function() {
    console.log('사용자가 나갔습니다.');
  });
});

server.on('listening', function() {
  console.log('서버 구동중');
});

server.on('close', function() {
  console.log('서버를 종료합니다.');
});

server.listen(3000);
