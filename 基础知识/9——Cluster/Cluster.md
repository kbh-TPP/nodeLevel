## 概述
	
### 1.1 基本用法
	
	Node.js默认单进程运行，对于32位系统最高可以使用512MB内存，对于64位最高可以使用1GB内存。
	对于多核CPU的计算机来说，这样做效率很低，因为只有一个核在运行，其他核都在闲置。
	cluster模块就是为了解决这个问题而提出的。

	cluster模块允许设立一个主进程和若干个worker进程，由主进程监控和协调worker进程的运行。
	worker之间采用进程间通信交换消息，cluster模块内置一个负载均衡器，
	采用Round-robin算法协调各个worker进程之间的负载。运行时，所有新建立的链接都由主进程完成，
	然后主进程再把TCP连接分配给指定的worker进程。

```js

    // cluster.js
    var cluster = require('cluster');
    var os = require('os');
    var start = require("./app.js");
    
    if (cluster.isMaster){
      for (var i = 0, n = os.cpus().length; i < n; i += 1){
        cluster.fork();
      }
    } else {
        start.start();
    }
    
    // app.js
    var http = require('http');
    exports.start = function () {
        console.log("start");
        http.createServer(function(req, res) {
            res.writeHead(200);
            res.end("hello world\n");
    
        }).listen(8000);
    };
    
    // 执行 node cluster

```

    上面这段代码有一个缺点，就是一旦work进程挂了，主进程无法知道。为了解决这个问题，可以在主进程部署online事件和exit事件的监听函数。
    
```js

    var cluster = require('cluster');
    var start = require("./app.js");

    if (cluster.isMaster) {
        var numWorkers = require('os').cpus().length;
        console.log('Master cluster setting up ' + numWorkers + ' workers...');

        for (var i = 0; i < numWorkers; i++) {
            cluster.fork();
        }

        // 这里通过 cluster 监控了所有启动的 worker进程
        cluster.on('online', function(worker) {  
            console.log("worker id = ", worker.id);   
            console.log('Worker ' + worker.process.pid + ' is online');
        });

        cluster.on('exit', function(worker, code, signal) {
            console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
            console.log('Starting a new worker');
            cluster.fork();
        });

    } else {
        start.start();
    }

    // 输出
        Master cluster setting up 4 workers...
        worker id =  1
        Worker 22320 is online
        worker id =  4
        Worker 22323 is online
        worker id =  3
        Worker 22322 is online
        worker id =  2
        Worker 22321 is online
        start
        start
        start
        start

```

    上面代码中，主进程一旦监听到worker进程的exit事件，就会重启一个worker进程。worker进程一旦启动成功，可以正常运行了，就会发出online事件。



### 1.2 worker 对象
    
    worker对象是cluster.fork()的返回值，代表一个worker进程。
    它的属性和方法如下：

#### 1.2.1 worker.id，
worker.id返回当前worker的独一无二的进程编号。这个编号也是cluster.workers中指向当前进程的索引值。

#### 1.2.2 worker.process
所有的worker进程都是用child_process.fork()生成的。child_process.fork()返回的对象，就被保存在worker.process之中。通过这个属性，可以获取worker所在的进程对象。

#### 1.2.3 worker.send()
该方法用于在主进程中，向子进程发送信息。

```js

    if (cluster.isMaster) {
        var worker = cluster.fork();
        worker.send('主进程');                       // 向子进程去发送消息
        worker.on('message', function(message) {    // 主进程通过子进程的实例去接收消息
            console.log("message = ", message);
        });

    } else if (cluster.isWorker) {
        process.on('message', function(msg) {
            console.log('msg = ', msg);
            process.send("你好");
        });
    }

    //  $ node cluster
    //  msg =  主进程
    //  message =  主进程
    //  message =  你好

```
    
    上面代码的作用是，worker进程对主进程发出的每个消息，都做回声。
    在worker进程中，要向主进程发送消息，使用process.send(message)；要监听主进程发出的消息，使用下面的代码。


### 1.3 cluster.workers对象
    
    该对象只有主进程才有，包含了所有worker进程。每个成员的键值就是一个worker进程对象，键名就是该worker进程的worker.id属性。

```js

    function eachWorker(callback) {
        for (var id in cluster.workers) {
            callback(cluster.workers[id]);
        }
    }
    eachWorker(function(worker) {
        worker.send('big announcement to all workers');
    });

```

    上面代码用来遍历所有worker进程。
    当前socket的data事件，也可以用id属性识别worker进程。

```js

    socket.on('data', function(id) {
        var worker = cluster.workers[id];
    });

```


## 2 cluster模块的属性与方法

#### 2.1 isMaster，isWorker

    isMaster属性返回一个布尔值，表示当前进程是否为主进程。这个属性由process.env.NODE_UNIQUE_ID决定，如果process.env.NODE_UNIQUE_ID为未定义，就表示该进程是主进程。
    isWorker属性返回一个布尔值，表示当前进程是否为work进程。它与isMaster属性的值正好相反。

#### 2.2 fork()

    fork方法用于新建一个worker进程，上下文都复制主进程。只有主进程才能调用这个方法。
    该方法返回一个worker对象。

#### 2.3 kill()
    
    kill方法用于终止worker进程。它可以接受一个参数，表示系统信号。

    如果当前是主进程，就会终止与worker.process的联络，然后将系统信号法发向worker进程。如果当前是worker进程，就会终止与主进程的通信，然后退出，返回0。

    在以前的版本中，该方法也叫做 worker.destroy() 。


#### 2.4 listening事件

    worker进程调用listening方法以后，“listening”事件就传向该进程的服务器，然后传向主进程。

    该事件的回调函数接受两个参数，一个是当前worker对象，另一个是地址对象，包含网址、端口、地址类型（IPv4、IPv6、Unix socket、UDP）等信息。这对于那些服务多个网址的Node应用程序非常有用。


```js

    cluster.on('listening', function (worker, address) {
        console.log("A worker is now connected to " + address.address + ":" + address.port);
    });

```

## 3、不中断地重启Node服务

### 3.1 思路
    
    重启服务需要关闭后再启动，利用cluster模块，可以做到先启动一个worker进程，再把原有的所有work进程关闭。这样就能实现不中断地重启Node服务。

    首先，主进程向worker进程发出重启信号。

```js

    workers[wid].send({type: 'shutdown', from: 'master'});

```

    worker进程监听message事件，一旦发现内容是shutdown，就退出。
    
```js

    process.on('message', function(message) {
        if(message.type === 'shutdown') {
            process.exit(0);
        }
    });

```

    下面是一个关闭所有worker进程的函数。

```js

    function restartWorkers() {
        var wid, workerIds = [];
        for (wid in cluster.workers) {
            workerIds.push(wid);
        }

        workerIds.forEach(function(wid) {
            cluster.workers[wid].send({
                text: 'shutdown',
                from: 'master'
            });

            setTimeout(function() {
                if (cluster.workers[wid]) {
                    cluster.workers[wid].kill('SIGKILL');
                }
            }, 5000);
        });
    };

```


### 3.2 实例
    
    下面是一个完整的实例，先是主进程的代码master.js。

```js

    var cluster = require('cluster');
    console.log('started master with ' + process.pid);

    // 新建一个worker进程
    cluster.fork();

    process.on('SIGHUP', function () {
        console.log('Reloading...');
        var new_worker = cluster.fork();
        new_worker.once('listening', function () {
        
        // 关闭所有其他worker进程
        for(var id in cluster.workers) {
            if (id === new_worker.id.toString()) continue;
            cluster.workers[id].kill('SIGTERM');
            }
        });
    });

```







































