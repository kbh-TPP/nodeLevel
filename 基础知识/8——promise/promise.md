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

    上面代码中，timeout方法返回一个Promise实例，表示一段时间以后才会发生的结果。过了指定的时间（ms参数）以后，Promise实例的状态变为Resolved，就会触发then方法绑定的回调函数。

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
    
    Promise实例具有then方法，也就是说，then方法是定义在原型对象Promise.prototype上的。它的作用是为Promise实例添加状态改变时的回调函数。前面说过，then方法的第一个参数是Resolved状态的回调函数，第二个参数（可选）是Rejected状态的回调函数。

    then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。

    这个和jQuery很像，就是每一个then的返回值是一个promise对象，这个时候，调用then的这个对象，通过resolve或者reject传入的参数，对作为这个promise对象的参数，继续执行。

#### Promise.prototype.catch() 
    
    Promise.prototype.catch方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数。

```js

    // 写法一
    var promise = new Promise(function(resolve, reject) {
      try {
        throw new Error('test');
      } catch(e) {
        reject(e);
      }
    });
    promise.catch(function(error) {
      console.log(error);
    });

    // 写法二
    var promise = new Promise(function(resolve, reject) {
      reject(new Error('test'));
    });
    promise.catch(function(error) {
      console.log(error);
    });

```
    比较上面两种写法，可以发现reject方法的作用，等同于抛出错误。

    一般来说，不要在then方法里面定义Reject状态的回调函数（即then的第二个参数），总是使用catch方法。

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





## 参考
    http://liubin.org/promises-book/#chapter2-how-to-write-promise
    http://es6.ruanyifeng.com/#docs/promise#Promise-的含义

