const net = require('net');
const ip = '127.0.0.1';
const port = 3000;
const socket = new net.Socket();

socket.connect({
  host : ip,
  port : port
}, function() {
  console.log('소켓 서버와 연결되었습니다.');

  socket.write('안녕! 난 클라이언트야');
  socket.end();
  socket.on('data', function(chunk) {
    console.log('서버로 부터 온 메세지 : ' + chunk.toString());
  });
  socket.on('end', function() {
    console.log('서버 연결 종료');
  });
});
