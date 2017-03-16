## Promise 的含义

    Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6将其写进了语言标准，统一了用法，原生提供了Promise对象。
    
    所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

### Promise 有2个特点，

    1）对象的状态不受外界影响，promise代表了异步操作，它有3个状态，Pending、resovled和rejected。只有知道异步操作的结果，才可以决定当前是那种状态。
    
    2）一旦状态改变，就不会在改变了。因为promise的状态改变，只有2钟可能，从Pending变为Resolved和从Pending变为Rejected。只要这2种情况发生，状态就不会改变了。
    
    有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise对象提供统一的接口，使得控制异步操作更加容易    
    
### Promise 缺点
    
    首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。
    其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
    第三，当处于Pending状态时，无法得知目前进展到哪一个阶段(刚刚开始还是即将完成)

    如果某些事件不断地反复发生，一般来说，使用 stream 模式是比部署Promise更好的选择。

## 基本用法
  
### 创建 promise

```js
    var promise = new Promise(function(resolve, reject) {
      // ... some code

      if (/* 异步操作成功 */){
        resolve(value);
      } else {
        reject(error);
      }
    });
```
	  Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。它们是两个函数，由JavaScript引擎提供，不用自己部署。

    resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从Pending变为Resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从Pending变为Rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

    Promise实例生成以后，可以用then方法分别指定Resolved状态和Reject状态的回调函数。

#### 穿件promise 的方法，还可以使用 promise.resolve({});
    比如 Promise.resolve(42); 可以认为是以下代码的语法糖。

```js
  new Promise(function(resolve){
      resolve(42);
  });
```

```js

	promise.then(function(value) {
	  // success
	}, function(error) {
	  // failure
	});

```

```js

	function timeout(ms) {
	  return new Promise((resolve, reject) => {
	    setTimeout(resolve, ms, 'done');
	  });
	}

	timeout(100).then((value) => {
	  console.log(value);
	});

```
    
    上面代码中，timeout方法返回一个Promise实例，表示一段时间以后才会发生的结果。过了指定的时间（ms参数）以后，Promise实例的状态变为Resolved，就会触发then方法绑定的回调函数。


```js
  // 这个例子，还挺有意义的
  setTimeout(function() {

      console.log(arguments);

  }, 100, 'done', 'error');

  // 输出
  //      { '0': 'done', '1': 'error' }
```


```js
    
    function loadImageAsync(url) {
        console.log("loadImageAsync start");

        return new Promise(function(resolve, reject) {
            var image = new Image();

            image.onload = function() {

                console.log("loadImageAsync end");

                resolve(image);
            };

            image.onerror = function() {
                reject(new Error('Could not load image at ' + url));
            };

            image.src = url;
        });
    }

    var urlPath = "https://www.baidu.com/img/bd_logo1.png"
    loadImageAsync(urlPath).then(data => {
        console.log('sucess', data);

    }, error => {
        console.log("error", error)
    });

```
    上面是一个异步加载图片的例子，还是挺酷的。所以说，promise的用处还是非常大的。当然，then方法中的两个函数，在这个函数中，依旧可以嵌套promise对象。

```js

    var p1 = new Promise(function (resolve, reject) {
      // ...
    });

    var p2 = new Promise(function (resolve, reject) {
      // ...
      resolve(p1);
    })

```
    上面就是说，p2的函数，将p1返回，

```js
    var p1 = new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error('fail')), 3000)
    })

    var p2 = new Promise(function (resolve, reject) {
      setTimeout(() => resolve(p1), 1000)
    })

    p2
      .then(result => console.log(result))
      .catch(error => console.log(error))

```
    逻辑是：首先执行p2这个对象内的方法，然后，1s之后成功返回p1;
    执行p1,3s之后抛出异常。触发catch方法。

```js

var p1 = new Promise(function(resolve, reject) {
    setTimeout(() => {
        console.log(arguments);
        reject(new Error('fail'))
    }, 3000, "apple")
})

var p2 = new Promise(function(resolve, reject) {
    setTimeout(() => {
        console.log(arguments);
        resolve(p1);
    }, 1000, 'blnanar')
})

p2.then(result => console.log(result))
    .catch(error => console.log(error))

// 输出
    { '0': [Function: s], '1': [Function: t] }
    { '0': [Function: s], '1': [Function: t] }
    Error: fail
        at Timeout.setTimeout (/记录/nodeLevel/基础知识/8——promise/example.js:27:16)
        at ontimeout (timers.js:369:18)
        at tryOnTimeout (timers.js:237:5)
        at Timer.listOnTimeout (timers.js:207:5)



// ---------------------------------------------
var p1 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        console.log(arguments);
        reject(new Error('fail'))
    }, 3000, "apple")
})

var p2 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        console.log(arguments);
        resolve(p1);
    }, 1000, 'blnanar')
})

p2.then(result => console.log(result))
    .catch(error => console.log(error))


// 输出
    { '0': 'blnanar' }
    { '0': 'apple' }
    Error: fail
        at Timeout._onTimeout (/记录/nodeLevel/基础知识/8——promise/example.js:27:16)
        at ontimeout (timers.js:369:18)
        at tryOnTimeout (timers.js:237:5)
        at Timer.listOnTimeout (timers.js:207:5)

    // 这不一样啊 ！！！

```


### 具体的方法
    

#### Promise.prototype.then()
    
    Promise实例具有then方法，它是定义在原型对象Promise.prototype上的。它的作用是为Promise实例状态改变时所触发的回调函数。
    then方法的第一个参数是Resolved状态的回调函数，第二个参数（可选）是Rejected状态的回调函数。
    then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。可以采用链式写法，因此，then方法后面再调用另一个then方法。
    这个和jQuery很像，就是每一个then的返回值是一个promise对象，这个时候，调用then的这个对象，
    通过resolve或者reject传入的参数，对作为这个promise对象的参数，继续执行。

    如果只处理成功，就直接使用 promise.then(onFulfilled);
    如果只处理失败，就直接使用 promise.then(undefined, onRejected)，这种方式，但是，官方还有一个更推荐的方式，
    是使用 promise.catch(onRejected)。


#### Promise.prototype.catch() 
    
    Promise.prototype.catch方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数。

```js

    function Test() {
        var promise = new Promise(function(resolve, reject) {
            try {
                console.log('promise action');
                throw new Error('test');
                resolve("OK");

            } catch (e) {
                reject(e);
            }
        });

        return promise;
    }

    // 写法一
    Test().catch(function(error) {
        console.log(error);
    });

    // 写法二
    Test().then(undefined, function(error) {
        console.log(error);
    });

```
    比较上面两种写法，可以发现reject方法的作用，等同于抛出错误。
    一般来说，不要在then方法里面定义Reject状态的回调函数（即then的第二个参数），总是使用catch方法，会是一个比较好的选择。

```js

    // bad
    promise
      .then(function(data) {
        // success
      }, function(err) {
        // error
      });

    // good
    promise
      .then(function(data) { //cb
        // success
      })
      .catch(function(err) {
        // error
      });

```   
    上面代码中，第二种写法要好于第一种写法，理由是第二种写法可以捕获前面then方法执行中的错误，也更接近同步的写法（try/catch）。因此，建议总是使用catch方法，而不使用then方法的第二个参数。


    跟传统的try/catch代码块不同的是，如果没有使用catch方法指定错误处理的回调函数，Promise对象抛出的错误不会传递到外层代码，即不会有任何反应。

```js

    var someAsyncThing = function() {
      return new Promise(function(resolve, reject) {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2);
      });
    };

    someAsyncThing().then(function() {
      console.log('everything is great');
    });

```
    上面代码中，someAsyncThing函数产生的Promise对象会报错，但是由于没有指定catch方法，这个错误不会被捕获，也不会传递到外层代码，导致运行后没有任何输出。

    1）Chrome浏览器不遵守这条规定，它会抛出错误“ReferenceError: x is not defined”。
    2）在node里面，也不遵循这个条件 ，也会保持。

```js
    // 要这么写，会优雅很多
    var someAsyncThing = function() {
        return new Promise(function(resolve, reject) {

            reject("error");
        });
    };

    someAsyncThing().then(function() {
        console.log('everything is great');
    }).catch(function(error) {
        console.log(error);
    });

```

##### 以后，写代码的时候，promise减少【try/catch】的使用。使用catch，并少then中的第二个函数的使用。


#### Promise.all()
    
    Promise.all方法用于将多个Promise实例，包装成一个新的Promise实例。

```js

    var p = Promise.all([p1, p2, p3]);

```

    上面代码中，Promise.all方法接受一个数组作为参数，p1、p2、p3都是Promise对象的实例，如果不是，就会先调用下面讲到的Promise.resolve方法，将参数转为Promise实例，再进一步处理。（Promise.all方法的参数可以不是数组，但必须具有Iterator接口，且返回的每个成员都是Promise实例。）   

    p的状态由p1、p2、p3决定，分成两种情况。

    （1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。

    （2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。


```js

    // 生成一个Promise对象的数组
    var promises = [2, 3, 5, 7, 11, 13].map(function (id) {
      return getJSON("/post/" + id + ".json");
    });

    Promise.all(promises).then(function (posts) {
      // ...
    }).catch(function(reason){
      // ...
    });

```
    
    这里有2点需要注意，首先 [].map(funciton() {}); 是一个优雅的解决方法。
    其次，all，需要所有的promise对象，全部resolve之后，才会执行第一个方法。否则会，进入入第二个。


#### Promise.race()

    Promise.race方法同样是将多个Promise实例，包装成一个新的Promise实例。

```js

    var p = Promise.race([p1, p2, p3]);

```
    
    上面代码中，只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。


    Promise.race方法的参数与Promise.all方法一样，如果不是 Promise 实例，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。

    下面是一个例子，如果指定时间内没有获得结果，就将Promise的状态变为reject，否则变为resolve。

```js
   
    const p = Promise.race([
      fetch('/resource-that-may-take-a-while'),
      new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error('request timeout')), 5000)
      })
    ]);
    
    p.then(response => console.log(response));
    p.catch(error => console.log(error));

```

    这个fetch 需要了解一下才行，SW里面也会用到。就是网络会用到。

    上面代码中，如果5秒之内fetch方法无法返回结果，变量p的状态就会变为rejected，从而触发catch方法指定的回调函数。

```js

function timerPromisefy(delay) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(delay);
        }, delay);
    });
}
// 任何一个promise变为resolve或reject 的话程序就停止运行
Promise.race([
    timerPromisefy(1),
    timerPromisefy(32),
    timerPromisefy(64),
    timerPromisefy(128)
]).then(function (value) {
    console.log(value);    // => 1
});

```
    
    上面的代码创建了4个promise对象，这些promise对象会分别在1ms，32ms，64ms和128ms后变为确定状态，即FulFilled，并且在第一个变为确定状态的1ms后， .then 注册的回调函数就会被调用，这时候确定状态的promise对象会调用 resolve(1) 因此传递给 value 的值也是1，控制台上会打印出1来。


    下面我们再来看看在第一个promise对象变为确定（FulFilled）状态后，它之后的promise对象是否还在继续运行。

```js

var winnerPromise = new Promise(function (resolve) {
        setTimeout(function () {
            console.log('this is winner');
            resolve('this is winner');
        }, 4);
    });
var loserPromise = new Promise(function (resolve) {
        setTimeout(function () {
            console.log('this is loser');
            resolve('this is loser');
        }, 1000);
    });
// 第一个promise变为resolve后程序停止
Promise.race([winnerPromise, loserPromise]).then(function (value) {
    console.log(value);    // => 'this is winner'
});

```

    我们在前面代码的基础上增加了 console.log 用来输出调试信息。
    执行上面代码的话，我们会看到 winnter和loser promise对象的 setTimeout 方法都会执行完毕， console.log 也会分别输出它们的信息。
    也就是说， Promise.race 在第一个promise对象变为Fulfilled之后，并不会取消其他promise对象的执行。




#### Promise.resolve() 

    有时需要将现有对象转为Promise对象，Promise.resolve方法就起到这个作用。

```js
    
    var jsPromise = Promise.resolve($.ajax('/whatever.json'));
    

    //jsPromise instanceof Promise -- > true

```
    上面代码将jQuery生成的deferred对象，转为一个新的Promise对象。

    问题1： var testObj1 = $.ajax('/whatever.json'); 是什么类型的。


```js

    
    Promise.resolve('foo')
    
    // 等价于
    new Promise(resolve => resolve('foo'))


    // 注意
    Promise.resolve('foo').then(data => {
        console.log(data);
    })
    // foo

```
    
    Promise.resolve方法的参数分成四种情况。

##### （1）参数是一个Promise实例

    如果参数是Promise实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。

##### （2）参数是一个thenable对象
    
    thenable对象指的是具有then方法的对象，比如下面这个对象。
    thenable的对象，是具备有转换为一个promise对象能力的。

```js

    let thenable = {
        then: function(resolve, reject) {
          resolve(42);
        }
    };

```

    Promise.resolve方法会将这个对象转为Promise对象，然后就立即执行 thenable 对象的then方法。

```js

    let thenable = {
      then: function(resolve, reject) {
        console.log('then able object action');
        resolve(42);
      }
    };

    let p1 = Promise.resolve(thenable); 
    p1.then(function(value) {
      console.log(value);   // 42
    });

```
    
    首先，thenable 内的 then 方法，然后，P1就变成了 resolved 的状态，从而立刻执行后面的then方法。

```js

    var promise = Promise.resolve($.ajax('/test'));// => promise对象
    promise.then(function(value){
       console.log(value);
    });

    // 这里的  $.ajax 是一个 jquery 封装的ajax 对象。

```

##### （3）参数不是具有then方法的对象，或根本就不是对象
    
    如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的Promise对象，状态为Resolved。

```js

    var p = Promise.resolve('Hello');

    p.then(function (s){
      console.log(s)
    });
    // Hello

```
    
    上面代码生成一个新的Promise对象的实例p。由于字符串Hello不属于异步操作（判断方法是它不是具有then方法的对象），返回Promise实例的状态从一生成就是Resolved，所以回调函数会立即执行。Promise.resolve方法的参数，会同时传给回调函数。


##### （4）不带有任何参数

    Promise.resolve方法允许调用时不带参数，直接返回一个Resolved状态的Promise对象。
    所以，如果希望得到一个Promise对象，比较方便的方法就是直接调用Promise.resolve方法。

```js

    var p = Promise.resolve();

    p.then(function () {
      // ...
    });

```
    需要注意的是，立即resolve的Promise对象，是在本轮“事件循环”（event loop）的结束时，而不是在下一轮“事件循环”的开始时。

```js

    setTimeout(function () {
      console.log('four');
    }, 0);

    Promise.resolve().then(function () {
      console.log('three');
    });

    process.nextTick(function() {
        console.log('two');
    }, 0)
    
    console.log('one');

    // one
    // two
    // three
    // four

```
    上面代码中， setTimeout(fn, 0)在下一轮“事件循环”开始时执行，Promise.resolve()在本轮“事件循环”结束时执行，但是，会在 nextTick 之后执行。
    而，console.log(’one‘)则是立即执行，因此最先输出。




#### Promise.done() 

    Promise对象的回调链，不管以then方法或catch方法结尾，要是最后一个方法抛出错误，都有可能无法捕捉到（因为Promise内部的错误不会冒泡到全局）。因此，我们可以提供一个done方法，总是处于回调链的尾端，保证抛出任何可能出现的错误。

```js

    asyncFunc()
      .then(f1)
      .catch(r1)
      .then(f2)
      .done();

```

    // 就是为了捕获最后一个方法出现的异常。
    它的实现代码相当简单。

```js

    Promise.prototype.done = function (onFulfilled, onRejected) {
      this.then(onFulfilled, onRejected)
        .catch(function (reason) {
          // 抛出一个全局错误
          setTimeout(() => { throw reason }, 0);
        });
    };

```
    
    从上面代码可见，done方法的使用，可以像then方法那样用，提供Fulfilled和Rejected状态的回调函数，也可以不提供任何参数。但不管怎样，done都会捕捉到任何可能出现的错误，并向全局抛出。


#### Promise.finally()

    finally方法用于指定不管Promise对象最后状态如何，都会执行的操作。它与done方法的最大区别，它接受一个普通的回调函数作为参数，该函数不管怎样都必须执行。

    下面是一个例子，服务器使用Promise处理请求，然后使用finally方法关掉服务器。


```js

    server.listen(0)
      .then(function () {
        // run test
      })
      .finally(server.stop);

```


```js

    Promise.prototype.finally = function (callback) {
      let P = this.constructor;
      return this.then(
        value  => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
      );
    };

```


## 特性分析
    
### 1 promise 是否是异步执行

```js

var promise = new Promise(function (resolve){
    console.log("inner promise");   // 1
    resolve("HGWJ");
});

promise.then(function(value){
    console.log(value);             // 3
});

console.log("outer promise");       // 2

```    
    输出  
        inner promise
        outer promise
        HGWJ

```js

    Promise.resolve('HGWJ').then(function(data) {
        console.log(data);
    })

    setTimeout(function() {
        console.log('setTimeout');
    }, 0);

    process.nextTick(function() {
        console.log('nextTick');
    });

    console.log('console');
```

    输出
        console
        nextTick
        HGWJ
        setTimeout

    如此，可以证明，promise的执行，就是异步回调。在不考虑回调延迟的情况下。
    比如网络，或者I/O，它的执行顺序是在 nextTick --> Promise 0 --> setTimeout 0

### 2 不要对异步回调函数进行同步调用 中也有详细介绍。

    绝对不能对异步回调函数（即使在数据已经就绪）进行同步调用。
    如果对异步回调函数进行同步调用的话，处理顺序可能会与预期不符，可能带来意料之外的后果。
    对异步回调函数进行同步调用，还可能导致栈溢出或异常处理错乱等问题。
    如果想在将来某时刻调用异步回调函数的话，可以使用 setTimeout 等异步API。

    主要的问题是，执行时机是不确定的，会根据当时的情况而定，因此，就都写成异步即可。

```js

    function Test () {
        var promise = new Promise(function(resolve, reject) {

            // 业务 实现
            
            resolve("....");
            reject("...");
        });

        return promise;
    }

    // 这样写，流程就可控了。

```

### 3 promise chain 【promise的链式操作】

```js

    function taskA() {
        console.log("Task A");
        throw new Error("throw Error @ Task A")
    }
    function taskB() {
        console.log("Task B");  // 不会被调用
    }
    function onRejected(error) {
        console.log(error);     // => "throw Error @ Task A"
    }
    function finalTask() {
        console.log("Final Task");
    }

    var promise = Promise.resolve();
    promise
        .then(taskA)
        .then(taskB)
        .catch(onRejected)
        .then(finalTask);
```
    
    


### 4 每次调用then都会返回一个新创建的promise对象
    
    从代码上乍一看， aPromise.then(...).catch(...) 像是针对最初的 aPromise 对象进行了一连串的方法链调用。
    然而实际上不管是 then 还是 catch 方法调用，都返回了一个新的promise对象。

```js

    var aPromise = new Promise(function (resolve) {
        resolve(100);
    });
    var thenPromise = aPromise.then(function (value) {
        console.log(value);
    });
    var catchPromise = thenPromise.catch(function (error) {
        console.error(error);
    });

    console.log(aPromise !== thenPromise);          // => true
    console.log(thenPromise !== catchPromise);      // => true

```
    如果我们知道了 then 方法每次都会创建并返回一个新的promise对象的话，那么我们就应该不难理解下面代码中对 then 的使用方式上的差别了。

```js

    // 1: 对同一个promise对象同时调用 `then` 方法
    var aPromise = new Promise(function (resolve) {
        resolve(100);
    });
    aPromise.then(function (value) {
        return value * 2;
    });
    aPromise.then(function (value) {
        return value * 2;
    });
    aPromise.then(function (value) {
        console.log("1: " + value); // => 100
    })

    // vs

    // 2: 对 `then` 进行 promise chain 方式进行调用
    var bPromise = new Promise(function (resolve) {
        resolve(100);
    });
    bPromise.then(function (value) {
        return value * 2;
    }).then(function (value) {
        return value * 2;
    }).then(function (value) {
        console.log("2: " + value); // => 100 * 2 * 2
    });

```
   
    第1种写法中并没有使用promise的方法链方式，这在Promise中是应该极力避免的写法。这种写法中的 then 调用几乎是在同时开始执行的，而且传给每个 then 方法的 value 值都是 100 。

    第2中写法则采用了方法链的方式将多个 then 方法调用串连在了一起，各函数也会严格按照 resolve → then → then → then 的顺序执行，并且传给每个 then 方法的 value 的值都是前一个promise对象通过 return 返回的值。


### 5  then or catch? 

```js

    function throwError(value) {
        // 抛出异常
        throw new Error(value);
    }
    // <1> onRejected不会被调用
    function badMain(onRejected) {
        return Promise.resolve(42).then(throwError, onRejected);
    }
    // <2> 有异常发生时onRejected会被调用
    function goodMain(onRejected) {
        return Promise.resolve(42).then(throwError).catch(onRejected);
    }
    // 运行示例
    badMain(function(){
        console.log("BAD");
    });
    goodMain(function(){
        console.log("GOOD");
    });

    // 输出
        GOOD
        (node:3484) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: 42

```
    
    在上面的代码中， badMain 是一个不太好的实现方式（但也不是说它有多坏）,goodMain 则是一个能非常好的进行错误处理的版本。
    
    为什么说 badMain 不好呢？，因为虽然我们在 .then 的第二个参数中指定了用来错误处理的函数，
    但实际上它却不能捕获第一个参数 onFulfilled 指定的函数（本例为 throwError ）里面出现的错误。
    
    也就是说，这时候即使 throwError 抛出了异常，onRejected 指定的函数也不会被调用（即不会输出"BAD"字样）。
    与此相对的是， goodMain 的代码则遵循了 throwError→onRejected 的调用流程。 这时候 throwError 中出现异常的话，在会被方法链中的下一个方法，即 .catch 所捕获，进行相应的错误处理。

    then 方法中的onRejected参数所指定的回调函数，实际上针对的是其promise对象或者之前的promise对象，而不是针对 .then 方法里面指定的第一个参数，即onFulfilled所指向的对象，这也是 then 和 catch 表现不同的原因。

    说白了，就是因为，catch 还能捕获 then 中 函数【onFulfilled】和【onRejected】中的异常。


## 参考
    http://liubin.org/promises-book/#chapter2-how-to-write-promise
    http://es6.ruanyifeng.com/#docs/promise#Promise-的含义
    http://liubin.org/promises-book/

