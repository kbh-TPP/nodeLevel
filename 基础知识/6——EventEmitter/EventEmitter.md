## Events模块

###
    回调函数模式让 Node 可以处理异步操作。但是，为了适应回调函数，异步操作只能有两个状态：开始和结束。
    对于那些多状态的异步操作（状态1，状态2，状态3，……），回调函数就会无法处理，
    你不得不将异步操作拆开，分成多个阶段。每个阶段结束时，调用下一个回调函数。
    为了解决这个问题，Node 提供 Event Emitter 接口。通过事件，解决多状态异步操作的响应问题。
    
    
## 1——概述
    Event Emitter 是一个接口，可以在任何对象上部署。这个接口由events模块提供。
    
```js
    
    var EventEmitter = require('events').EventEmitter;
    var emitter = new EventEmitter();
    
    emitter.on('testEvent', function () {
        console.log('emitter event already exit... 1');
    });
    
    emitter.on('testEvent', function () {
        console.log('emitter event already exit... 2');
    });
    
    
    function f() {
        console.log('start');
    
        emitter.emit('testEvent');
    
        console.log('end');
    }
    
    f();
    
    输出
    
        start
        emitter event already exit... 1
        emitter event already exit... 2
        end
```
    上面代码中，【EventEmitter】对象实例【emitter】就是消息中心。
    通过on方法为someEvent事件指定回调函数，通过emit方法触发someEvent事件。
    上面代码还表明，EventEmitter对象的事件触发和监听是同步的，即只有事件的回调函数执行以后，函数f才会继续执行。
    
## 2——Event Emitter 接口的部署    
    
    Event Emitter 接口可以部署在任意对象上，使得这些对象也能订阅和发布消息，好酷。
   
```js
    var EventEmitter = require('events').EventEmitter;
    
    function Dog(name) {
      this.name = name;
      this.dog = function() {
        console.log('dog');
      }
    }
    
    Dog.prototype.__proto__ = EventEmitter.prototype;
    // 另一种写法
    // Dog.prototype = Object.create(EventEmitter.prototype);
    
    var simon = new Dog('simon');
    
    simon.on('fuck', function () {
      console.log(this.name + ' barked');
    });
    
    setInterval(function () {
      simon.emit('fuck');
    }, 500);
    
``` 
    上面的代码构造了一个Dog类，然后，它继承子【EventEmitter】，因此，Dog就具有了【EventEmitter】的接口。
    为dog实例提供指定的 fuck 事件，而后使用 emit 去触发 fuck 事件。
    有了 【EventEmitter】 就提供了一个 事件触发器，因此，也可以完成观察者模式了，很酷的模块。
    

### 3——Node 内置模块util的inherits方法
    Node 内置模块util的inherits方法，提供了另一种继承 Event Emitter 接口的方法。

```js
// file Name Fuck.js
    var util = require('util');
    var EventEmitter = require('events').EventEmitter;
    
    var Fuck = function (station) {
        var self = this;
    
        setTimeout(function() {
    
            console.log("emit start 触发");
            self.emit('start', station);
    
        }, 0);
    
        setTimeout(function() {
    
            console.log("emit end 触发");
            self.emit('end', station);
    
        }, 5000);
    
        // this.on('newListener', function(listener) {
        //     console.log('Event Listener: ' + listener);
        // });
    };
    
    util.inherits(Fuck, EventEmitter);
    module.exports = Fuck;

// file name demo.js
    var Fuck = require("./Fuck");
    var station = {};
    var fuck = new Fuck(station);
    console.log('new Fuck 的时候，会执行setTimeout方法，进行事件 start 和 end 事件的触发。 \n');
    
    
    fuck.on('start', function(station) {
        console.log(" 触发后 start 的回调 \n");
    });
    
    fuck.on('end', function(station) {
        console.log(" 触发后 end 的回调 \n");
    });
    
```


### 4 Event Emitter 的实例方法
    
    emitter.on(name, f)                     对事件name指定监听函数f
    emitter.addListener(name, f)            addListener是on方法的别名
    emitter.once(name, f)                   与on方法类似，但是监听函数f是一次性的，使用后自动移除
    emitter.listeners(name)                 返回一个数组，成员是事件name所有监听函数
    emitter.removeListener(name, f)         移除事件name的监听函数f
    emitter.removeAllListeners(name)        移除事件name的所有监听函数
    
    
#### 4.1 emit() EventEmitter实例对象的emit方法，用来触发事件。它的第一个参数是事件名称，其余参数都会依次传入回调函数。
    
    EventEmitter实例对象的emit方法，用来触发事件。它的第一个参数是事件名称，其余参数都会依次传入回调函数。
    
    var EventEmitter = require('events').EventEmitter;
    var myEmitter = new EventEmitter();
    
    var connection = function (id, tst) {
        console.log('client id: ' + id + " tst = " + tst);

    };
    
    myEmitter.on('connection', connection);

    myEmitter.emit('connection', 6);
    myEmitter.emit('connection', 7);

    // client id: 6
   
#### 4.2 once() 该方法类似于on方法，但是回调函数只触发一次。
    
    var EventEmitter = require('events').EventEmitter;
    var myEmitter = new EventEmitter;
    
    myEmitter.once('message', function(msg){
        console.log('message: ' + msg);
    });
    
    myEmitter.emit('message', 'this is the first message');
    myEmitter.emit('message', 'this is the second message');
    myEmitter.emit('message', 'welcome to nodejs');
    
    多次触发并没有什么用，只能触发一次。
    
    上面代码触发了三次message事件，但是回调函数只会在第一次调用时运行。
    下面代码指定，一旦服务器连通，只调用一次的回调函数。
    server.once('connection', function (stream) {
        console.log('Ah, we have our first user!');
    });

#### 4.3 removeListener() 该方法用于移除回调函数。它接受两个参数，第一个是事件名称，第二个是回调函数名称。这就是说，不能用于移除匿名函数。
    
```js

    var EventEmitter = require('events').EventEmitter;
    var emitter = new EventEmitter;
    emitter.on('message', console.log);
    
    setInterval(function(){
        emitter.emit('message', 'fuck rule');
    }, 1000);
    
    setTimeout(function(){
        emitter.removeListener('message', console.log);
    }, 10000);

```

    上面代码每1000毫秒触发一次message事件，直到10000毫秒后取消监听。
    另一个例子是使用removeListener方法模拟once方法
```js
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter;

function onlyOnce () {

    console.log("You'll never see this again");
    emitter.removeListener("test", onlyOnce);
}

emitter.on("test", onlyOnce);
emitter.emit("test");       // 只执行一次
emitter.emit("test");

```

#### 4.4 setMaxListeners(),Node默认允许同一个事件最多可以指定10个回调函数。
```js

    var EventEmitter = require('events').EventEmitter;
    var emitter = new EventEmitter;
    emitter.setMaxListeners(20);
    emitter.on('someEvent', function () { console.log('event 1'); });
    emitter.on('someEvent', function () { console.log('event 2'); });
    emitter.on('someEvent', function () { console.log('event 3'); });
    emitter.on('someEvent', function () { console.log('event 4'); });
    emitter.on('someEvent', function () { console.log('event 5'); });
    emitter.on('someEvent', function () { console.log('event 6'); });
    emitter.on('someEvent', function () { console.log('event 7'); });
    emitter.on('someEvent', function () { console.log('event 8'); });
    emitter.on('someEvent', function () { console.log('event 9'); });
    emitter.on('someEvent', function () { console.log('event 10'); });
    emitter.on('someEvent', function () { console.log('event 21'); });
    emitter.on('someEvent', function () { console.log('event 31'); });
    
    emitter.emit("someEvent");


   
    (node:14895) Warning: Possible EventEmitter memory leak detected. 11 someEvent listeners added. 
    Use emitter.setMaxListeners() to increase limit

    超过了预期10个，然后，就给警告。
    
    emitter.setMaxListeners(20);        // 去掉错误提示
    
```

#### 4.5  removeAllListeners 该方法用于移除某个事件的所有回调函数。


#### 4.6  listeners方法接受一个事件名称作为参数，返回该事件所有回调函数组成的数组。
 
```js

var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter;
function onlyOnce1 () {
    console.log('onlyOnce1 start —— ', ee.listeners("firstConnection"));
    ee.removeListener("firstConnection", onlyOnce1);
    console.log('onlyOnce1 end —— ',ee.listeners("firstConnection"));
}
function onlyOnce2 () {
    console.log("onlyOnce2 start —— ", ee.listeners("firstConnection"));
    // ee.removeListener("firstConnection", onlyOnce2);
    console.log("onlyOnce2 end —— ", ee.listeners("firstConnection"));
}

ee.on("firstConnection", onlyOnce1);
ee.on("firstConnection", onlyOnce2);

ee.emit("firstConnection");
ee.emit("firstConnection");
    
    // 输出 
    onlyOnce1 start ——  [ [Function: onlyOnce1], [Function: onlyOnce2] ]
    onlyOnce1 end ——  [ [Function: onlyOnce2] ]
    onlyOnce2 start ——  [ [Function: onlyOnce2] ]
    onlyOnce2 end ——  [ [Function: onlyOnce2] ]
    onlyOnce2 start ——  [ [Function: onlyOnce2] ]
    onlyOnce2 end ——  [ [Function: onlyOnce2] ]
```
   【注意】—— 这里的看出通过 【on】进行的事件监听，是顺序压入。因此，执行是有顺序的。 

    

### 5 错误捕获
    事件处理过程中抛出的错误，可以使用try...catch捕获。
    
```js

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

emitter.on('beep', function () {
    console.log('beep2');
});

emitter.on('beep', function () {
    throw Error('oops! 3');
});

emitter.on('beep', function () {
    console.log('beep again 4');
});

console.log('before emit 1');

try {
    emitter.emit('beep');
} catch(err) {
    console.error('caught while emitting:', err.message);
}

console.log('after emit 5');


```
    输出结果
        before emit 1
        caught while emitting: oops! 3
        beep2
        after emit 5
        
        before emit 1
        beep2
        after emit 5
        caught while emitting: oops! 3
        
    输出结果 —— caught while emitting: oops! 3 的输出顺序不确定，
        1）可以看到，第二个监听函数抛出的错误被try...catch代码块捕获了。一旦被捕获，该事件后面的监听函数都不会再执行了。
        2）通过 on 监听的执行顺序，是可以保证，谁先绑定，谁先执行，【队列】
    
    
    如果不使用try...catch，可以让进程监听uncaughtException事件。
```js
process.on('uncaughtException', function (err) {
  console.error('uncaught exception:', err.stack || err);
  // 关闭资源
  closeEverything(function(err) {
    if (err)
      console.error('Error while closing everything:', err.stack || err);
    // 退出进程
    process.exit(1);
  });
});

```    

### 6 事件类型 Events模块默认支持两个事件

    newListener事件：添加新的回调函数时触发
    removeListener事件：移除回调时触发

```js
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

```
    输出
         ------------------------------------- 
        removeListener
        function (evtName) {
            console.log("Removed Listener: " + arguments);
        }
        ++++++++++++++++++++++++++++++++++++++++++++
         ------------------------------------- 
        new-event
        function vivi() {}
        ++++++++++++++++++++++++++++++++++++++++++++
        
        Removed Listener: [object Arguments]
        
        上面触发了2次 newListener 和 一次 removerListen
        因为，挂载 【removeListener】和 【new-event】的时候，newListener 已经开始监听了。
    
        
### 7 进阶

#### 7.1 【node event 源码】 - [lib/events.js](https://github.com/nodejs/node/blob/v6.0.0/lib/events.js)
       
   这是Node.Js官网对自身的介绍,明确强调了Node.Js使用了一个事件驱动、非阻塞式 I/O 的模型,使其轻量又高效。
   而且在Node中大量核心模块都使用了Event的机制,因此可以说是整个Node里最重要的模块之一.
   
   它实现的就是观察模式，观察者是一种设计模式。
   首先，事件会注册到一个代理上去，包括他的执行方法。
   而后，事件触发的时候，观察者会去通知，那些注册过事件的方法或者对象。
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    
    
    