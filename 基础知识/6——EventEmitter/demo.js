// var Fuck = require("./Fuck");


// var station = {
//     freq: '80.16',
//     name: 'Rock N Roll Radio',
// };


// var fuck = new Fuck(station);
// console.log('new Fuck 的时候，会执行setTimeout方法，进行事件 start 和 end 事件的触发。 \n');


// fuck.on('start', function(station) {
//     console.log(" 触发后 start 的回调 \n");
// });

// fuck.on('end', function(station) {
//     console.log(" 触发后 end 的回调 \n");
// });

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

emitter.on('testEvent', function() {
	console.log('emitter event already exit... 1');
});

emitter.on('testEvent', function() {
	console.log('emitter event already exit... 2');
});

process.on("testEvent", function() {
	console.log("你不知道，这个世界是为什么？");
})

function f() {
	console.log('start');

	emitter.emit('testEvent');

	console.log('end');
}

f();