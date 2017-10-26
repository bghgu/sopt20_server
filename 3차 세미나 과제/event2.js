
var Cat = function(){}; //일반 클래스 생성
var util = require('util');
var EventEmitter = require('events').EventEmitter;

util.inherits(Cat,EventEmitter);

var cat = new Cat();
cat.on('speak', function(name){
  console.log(name+'이가 말한다 흠냐리냥냥');
});

cat.emit('speak','시형');
//직접 만든 이벤트를 강제 발생.
