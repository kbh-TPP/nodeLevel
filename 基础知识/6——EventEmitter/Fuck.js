// -------------------------------------------------------------------

// var EventEmitter = require('events').EventEmitter;
// var emitter = new EventEmitter();
//
// emitter.on('testEvent', function () {
//     console.log('emitter event already exit... 1');
// });
//
// emitter.on('testEvent', function () {
//     console.log('emitter event already exit... 2');
// });
//
//
// function f() {
//     console.log('start');
//
//     emitter.emit('testEvent');
//
//     console.log('end');
// }
//
// f();

// -------------------------------------------------------------------

// var EventEmitter = require('events').EventEmitter;

// function Dog(name) {
//     this.name = name;
//     this.dog = function() {
//         console.log('dog name ', this.name);
//     }
// }
//
// // Dog.prototype.__proto__ = EventEmitter.prototype;
// // 另一种写法
// Dog.prototype = Object.create(EventEmitter.prototype);
//
// var simon = new Dog('simon');
//
// simon.on('bark', function () {
//     simon.dog();
// });
//
// setInterval(function () {
//     simon.emit('bark');
// }, 500);

// -------------------------------------------------------------------

// var util = require('util');
// var EventEmitter = require('events').EventEmitter;
//
// var Fuck = function (station) {
//     var self = this;
//
//     setTimeout(function() {
//
//         console.log("emit start 触发");
//         self.emit('start', station);
//
//     }, 0);
//
//     setTimeout(function() {
//
//         console.log("emit end 触发");
//         self.emit('end', station);
//
//     }, 5000);
//
//     // this.on('newListener', function(listener) {
//     //     console.log('Event Listener: ' + listener);
//     // });
// };

//
//
// util.inherits(Fuck, EventEmitter);
// module.exports = Fuck;
//


// -------------------------------------------------------------------

// var EventEmitter = require('events').EventEmitter;
// var myEmitter = new EventEmitter();
//
// var connection = function (id, tst) {
//     console.log('client id: ' + id + " tst = " + tst);
// };
//
// myEmitter.on('connection', connection);
// myEmitter.emit('connection', 6);
// myEmitter.emit('connection', 7);

// client id: 6

// -------------------------------------------------------------------

// var EventEmitter = require('events').EventEmitter;
// var myEmitter = new EventEmitter;
//
// myEmitter.once('message', function(msg){
//     console.log('message: ' + msg);
// });
//
// myEmitter.emit('message', 'this is the first message');
// myEmitter.emit('message', 'this is the second message');
// myEmitter.emit('message', 'welcome to nodejs');


// -------------------------------------------------------------------


// var EventEmitter = require('events').EventEmitter;
// var emitter = new EventEmitter;
//
// emitter.on('message', console.log);
//
// setInterval(function(){
//     emitter.emit('message', 'fuck rule');
// }, 1000);
//
// setTimeout(function(){
//     emitter.removeListener('message', console.log);
// }, 10000);

// -------------------------------------------------------------------



// var EventEmitter = require('events').EventEmitter;
// var emitter = new EventEmitter;
//
// function onlyOnce () {
//
//     console.log("You'll never see this again");
//     emitter.removeListener("test", onlyOnce);
// }
//
// emitter.on("test", onlyOnce);
// emitter.emit("test");
// emitter.emit("test");

// -------------------------------------------------------------------

// var EventEmitter = require('events').EventEmitter;
// var emitter = new EventEmitter;
// emitter.setMaxListeners(20);
// emitter.on('someEvent', function () { console.log('event 1'); });
// emitter.on('someEvent', function () { console.log('event 2'); });
// emitter.on('someEvent', function () { console.log('event 3'); });
// emitter.on('someEvent', function () { console.log('event 4'); });
// emitter.on('someEvent', function () { console.log('event 5'); });
// emitter.on('someEvent', function () { console.log('event 6'); });
// emitter.on('someEvent', function () { console.log('event 7'); });
// emitter.on('someEvent', function () { console.log('event 8'); });
// emitter.on('someEvent', function () { console.log('event 9'); });
// emitter.on('someEvent', function () { console.log('event 10'); });
// emitter.on('someEvent', function () { console.log('event 21'); });
// emitter.on('someEvent', function () { console.log('event 31'); });
//
// emitter.emit("someEvent");

// -------------------------------------------------------------------

// var EventEmitter = require('events').EventEmitter;
//
// var ee = new EventEmitter;
//
// function onlyOnce1 () {
//     console.log('onlyOnce1 start —— ', ee.listeners("firstConnection"));
//     ee.removeListener("firstConnection", onlyOnce1);
//     console.log('onlyOnce1 end —— ',ee.listeners("firstConnection"));
// }
//
// function onlyOnce2 () {
//     console.log("onlyOnce2 start —— ", ee.listeners("firstConnection"));
//     // ee.removeListener("firstConnection", onlyOnce2);
//     console.log("onlyOnce2 end —— ", ee.listeners("firstConnection"));
// }
//
// ee.on("firstConnection", onlyOnce1);
// ee.on("firstConnection", onlyOnce2);
//
// ee.emit("firstConnection");
// ee.emit("firstConnection");

// -------------------------------------------------------------------
//
// var EventEmitter = require('events').EventEmitter;
// var emitter = new EventEmitter();
//
// emitter.on('beep', function () {
//     console.log('beep2');
// });
//
// emitter.on('beep', function () {
//     throw Error('oops! 3');
// });
//
// emitter.on('beep', function () {
//     console.log('beep again 4');
// });
//
// console.log('before emit 1');
//
// emitter.emit('beep');
//
//
//
// process.on('uncaughtException', function (err) {
//     console.log('nihao');
// });
//
//
// console.log('after emit 5');


// -------------------------------------------------------------------


var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter;

ee.on("newListener", function (evtName) {
    console.log(" ------------------------------------- ");
    for (var pro in arguments) {
        console.log(arguments[pro].toString());
    }
    console.log("++++++++++++++++++++++++++++++++++++++++++++");
});

ee.on("removeListener", function (evtName) {
    console.log("Removed Listener: " + arguments);
});

function vivi() {}

ee.on("new-event", vivi);
ee.removeListener("new-event", vivi);
