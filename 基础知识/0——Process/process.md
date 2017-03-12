# Process

`process`对象是Node的一个全局对象，提供当前Node进程的信息。它可以在脚本的任意位置使用，不必通过`require`命令加载。该对象部署了`EventEmitter`接口。

## 进程的退出码

进程退出时，会返回一个整数值，表示退出时的状态。这个整数值就叫做退出码。下面是常见的Node进程退出码。

- 0，正常退出
- 1，发生未捕获错误
- 5，V8执行错误
- 8，不正确的参数
- 128 + 信号值，如果Node接受到退出信号（比如SIGKILL或SIGHUP），它的退出码就是128加上信号值。由于128的二进制形式是10000000, 所以退出码的后七位就是信号值。

Bash可以使用环境变量`$?`，获取上一步操作的退出码。[这个不错]

```bash
    
    process.on('uncaughtException', function (err) {
        console.error('got an error: %s', err.message);
        process.exit(1);
    });
    
    setTimeout(function () {
        throw new Error('fuck');
    }, 100);


    $ node nonexist.js
    Error: Cannot find 'nonexist.js'
    
    $ echo $?
    1
```

上面代码中，Node执行一个不存在的脚本文件，结果报错，退出码就是1。

## 属性

process对象提供一系列属性，用于返回系统信息。

- **process.argv**：返回当前进程的命令行参数数组。
- **process.env**：返回一个对象，成员为当前Shell的环境变量，比如`process.env.HOME`。
- **process.installPrefix**：node的安装路径的前缀，比如`/usr/local`，则node的执行文件目录为`/usr/local/bin/node`。
- **process.pid**：当前进程的进程号。
- **process.platform**：当前系统平台，比如Linux。
- **process.title**：默认值为“node”，可以自定义该值。
- **process.version**：Node的版本，比如v0.10.18。

fileName = process.js
```js    
    
    console.log("process.env.HGWJ", process.env.HGWJ);
    console.log("process.platform = ",  process.platform);
    
     if(process.env.NODE_ENV === 'production'){
         console.log('生产环境');
     }
     else{
         console.log('非生产环境');
     }
    
```

```bash

    export HGWJ="Hello, world" && node process.js
    
        输出 —— 
            process.env.HGWJ =  Hello, world
            process.platform =  darwin

    [注意] 
        这里说明一个问题，在 mac 上测试，export 变量名 = 变量值，
    在关闭终端以后，下次在进入，这个变量就没有了。不是持久化数据。

```

### 配置

    这里稍微扩展一下，require 可以读取文件的配置方式。
    文件格式一般为 —— JSON， js， YAML



下面是主要属性的介绍。

### stdout，stdin，stderr

以下属性指向系统I/O。

**（1）stdout**

stdout属性指向标准输出（文件描述符1）。它的write方法等同于console.log，可用在标准输出向用户显示内容。

```javascript

console.log = function(d) {
    process.stdout.write(d + '\n');
};

```

下面代码表示将一个文件导向标准输出。

```javascript
var fs = require('fs');

fs.createReadStream('wow.txt')
  .pipe(process.stdout);

      输出
          会把文件读入到内存,并显示到控制台中

```
        上面代码中，由于 process.stdout 和 process.stdin 的通信，都是流（stream）形式，
    所以必须通过pipe管道命令中介。尝试解释理解一下pipe，所谓中介,就可以理解为将读取的txt文件，
    暂时存储一下，作为 proess.stdout 的输入参数。
        pipe 使用的时候，其实和内存一样，防止同时读写。

```javascript

var fs = require('fs');
var zlib = require('zlib');

fs.createReadStream('wow.txt')
  .pipe(zlib.createGzip())
  .pipe(process.stdout);

```

上面代码通过pipe方法，先将文件数据压缩，然后再导向标准输出。

**（2）stdin**

    stdin代表标准输入（文件描述符0）。

```javascript
process.stdin.pipe(process.stdout)
```

        上面代码表示将标准输入导向标准输出。

由于stdin和stdout都部署了stream接口，所以可以使用stream接口的方法。

```javascript
process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write('data: ' + chunk);
  }
});

process.stdin.on('end', function() {
  process.stdout.write('end');
});
```

**（3）stderr**

stderr属性指向标准错误（文件描述符2）。

### process.argv  [argv，execPath，execArgv]

argv属性返回一个数组，由命令行执行脚本时的各个参数组成。它的第一个成员总是node，第二个成员是脚本文件名，其余成员是脚本文件的参数。

请看下面的例子，新建一个脚本文件argv.js。

```javascript
// argv.js
console.log("argv: ",process.argv);
```

在命令行下调用这个脚本，会得到以下结果。

```javascript

    例子 (1)
    $ node argv.js a b c
    
    argv:  [ '/usr/local/bin/node',
      '/记录/Node知识体系/0——Process/process.js',
      'a',
      'b',
      'c',
      'd' ]
      
      
    例子（2）
    node --harmony process.js --hg wj yj        
    
    process.execArgv.forEach(function(val, index, array) {
        console.log("execArgv " + index + ': ' + val);
    });
    // 输出：
    // 0: --harmony
    
    process.argv.forEach(function(val, index, array) {
        console.log("argv " + index + ': ' + val);
    });
        
        execArgv 0: --harmony
        argv 0: /usr/local/bin/node
        argv 1: /记录/Node知识体系/0——Process/process.js
        argv 2: --hg
        argv 3: wj
        argv 4: yj
```

上面代码表示，argv返回数组的成员依次是命令行的各个部分，真正的参数实际上是从`process.argv[2]`开始。要得到真正的参数部分，可以把argv.js改写成下面这样。

```javascript
    // argv.js
    var myArgs = process.argv.slice(2);
    console.log(myArgs);
```

execPath属性返回执行当前脚本的Node二进制文件的绝对路径。

```javascript
    > process.execPath
    '/usr/local/bin/node'
    >
```

###process对象提供以下方法：

    process.exit()：退出当前进程。
    process.cwd()：返回运行当前脚本的工作目录的路径。_
    process.chdir()：改变工作目录。
    process.nextTick()：将一个回调函数放在下次事件循环的顶部。效率更高，更准确。

```js

    process.cwd()
    '/记录/Node知识体系/0——Process'
    process.chdir("/记录/Node知识体系/")
    undefined
    process.cwd()
    '/记录/Node知识体系'
    process.chdir('/记录/Node知识体系/0——Process')
    undefined
    process.cwd()
    '/记录/Node知识体系/0——Process'
```


execArgv属性返回一个数组，成员是命令行下执行脚本时，在Node可执行文件与脚本文件之间的命令行参数。

```bash
# script.js的代码为
# console.log(process.execArgv);
$ node --harmony script.js --version
```

### process.env

`process.env`属性返回一个对象，包含了当前Shell的所有环境变量。比如，`process.env.HOME`返回用户的主目录。

通常的做法是，新建一个环境变量`NODE_ENV`，用它确定当前所处的开发阶段，生产阶段设为`production`，开发阶段设为`develop`或`staging`，然后在脚本中读取`process.env.NODE_ENV`即可。

运行脚本时，改变环境变量，可以采用下面的写法。

```bash
    $ export NODE_ENV=production && node app.js
    # 或者
    $ NODE_ENV=production node app.js
```

## 方法

process对象提供以下方法：

- **process.chdir()**：切换工作目录到指定目录。
- **process.cwd()**：返回运行当前脚本的工作目录的路径。
- **process.exit()**：退出当前进程。
- **process.getgid()**：返回当前进程的组ID（数值）。
- **process.getuid()**：返回当前进程的用户ID（数值）。
- **process.setgid()**：指定当前进程的组，可以使用数字ID，也可以使用字符串ID。
- **process.setuid()**：指定当前进程的用户，可以使用数字ID，也可以使用字符串ID。
- **process.nextTick()**：指定回调函数在当前执行栈的尾部、下一次Event Loop之前执行。
- **process.on()**：监听事件。


### process.cwd()，process.chdir()

`cwd`方法返回进程的当前目录（绝对路径），`chdir`方法用来切换目录。

```bash
    > process.cwd()
    '/home/aaa'
    
    > process.chdir('/home/bbb')
    > process.cwd()
    '/home/bbb'
```

注意，`process.cwd()`与`__dirname`的区别。【前者进程发起时的位置】，【后者是脚本的位置】，两者可能是不一致的。
比如，`node ./code/program.js`，对于`process.cwd()`来说，返回的是当前目录（`.`）；
对于`__dirname`来说，返回是脚本所在目录，即`./code/program.js`。

## process.nextTick()

`process.nextTick`将任务放到当前一轮事件循环（Event Loop）的尾部。

```bash

    process.nextTick(function () {
      console.log('下一次Event Loop即将开始!');
    });
```

上面代码可以用`setTimeout(f,0)`改写，效果接近，但是原理不同。

```bash

    setTimeout(function () {
      console.log('已经到了下一轮Event Loop！');
    }, 0)
```
```js

    setTimeout(function () {
        console.log("---- [ setTimeout 0] ----");
        process.nextTick(function () {
            console.log('---[ nextTick 0]--- ')
        });
    
    }, 1000);
    
    setTimeout(function () {
        console.log('---[ setTimeout action]--- ')
    }, 0);
    

    process.nextTick(function() {
        console.log('---[ nextTick action]--- ')
    });

    setTimeout(function () {
        process.nextTick(function () {
            console.log('---[ nextTick A]--- ')
        });
    
        setTimeout(function () {
            console.log("---- [ setTimeout A] ----");
        }, 0);
    
        setTimeout(function () {
            console.log("---- [ setTimeout B] ----");
        }, 0);
    
        process.nextTick(function () {
            console.log('---[ nextTick B]--- ')
        });
    
    }, 1000);
    
    
    setTimeout(function () {
        console.log("---- [ setTimeout 1] ----");
    
        process.nextTick(function () {
            console.log(' ---[ nextTick 1]--- ')
        });
    
    }, 1000);
    
```
    输出
        node process.js
            ---[ nextTick action]--- 
            ---[ setTimeout action]--- 
            ---- [ setTimeout 0] ----
            ---- [ setTimeout 1] ----
            ---[ nextTick 0]--- 
            ---[ nextTick A]--- 
            ---[ nextTick B]--- 
            ---[ nextTick 1]--- 
            ---- [ setTimeout A] ----
            ---- [ setTimeout B] ----



    `setTimeout(f,0)`是将任务放到下一轮事件循环的头部，因此`nextTick`会比它先执行。另外，
    `nextTick`的效率更高，因为不用检查是否到了指定时间。只要此时事件循环结束就可以执行了。

根据Node的事件循环的实现，基本上，【进入下一轮事件循环之后】的执行顺序如下，
记得是下次事件循环之后，也就是当此事件循环已经终止了。

1.`setTimeout(f,0)`
2.各种到期的回调函数
3.`process.nextTick` push(), sort(), reverse(), and splice() 

### 我们至少记住 2条粗浅的结论，有助于提升你的执行效率：
#### 1  如果可能的话，调用setTimeout时，尽量使用相同的超时值时间，
#### 2  尽量用 process.nextTick 来代替 setTimeout(fn ,0)

### process.exit()

`process.exit`方法用来退出当前进程。它可以接受一个数值参数，如果参数大于0，表示执行失败；如果等于0表示执行成功。

```bash
    if (err) {
      process.exit(1);
    } else {
      process.exit(0);
    }
```

`process.exit()`执行时，会触发`exit`事件。

### process.on()

`process`对象部署了EventEmitter接口，可以使用`on`方法监听各种事件，并指定回调函数。

```javascript

    process.on('uncaughtException', function(err){
      console.error('got an error: %s', err.message);
      
      //  process.exit(1);  // 退出，
      //  无须退出，报警即可
    });
    
    setTimeout(function(){
      throw new Error('fail');
    }, 100);
        
      //  这个可以平时使用一下，防止进程挂掉，可以写一些容错,处理
        
```

上面代码是`process`监听Node的一个全局性事件`uncaughtException`，只要有错误没有捕获，就会触发这个事件。

`process`支持的事件还有下面这些。

    - `data`事件：数据输出输入时触发
    - `SIGINT`事件：接收到系统信号`SIGINT`时触发，主要是用户按`Ctrl + c`时触发。
    - `SIGTERM`事件：系统发出进程终止信号`SIGTERM`时触发
    - `exit`事件：进程退出前触发

```javascript
        
    // 例子（1）
    process.on('SIGINT', function() {
        console.log('收到 SIGINT 信号, 退出，我就不是不退出。');
        // process.exit(0);
    });
    
    console.log('打印进程ID', process.pid);
    console.log('kill -s SIGINT ', process.pid);
    
    setTimeout(function() {
        console.log('end');
    }, 50000);
    
    $ node process 
        打印进程ID 90599
        kill -s SIGINT  90599
                                            $ kill -s SIGINT  90599 
          
        收到 SIGINT 信号, 退出。 
    
    
    // 例子（2）
    // 也可以忽略这个信号
    process.on('SIGINT', function() {
      console.log("Ignored Ctrl-C");
    });
    
```

使用时，向该进程发出系统信号，就会导致进程退出。

```bash
    $ kill -s SIGINT [process_id]
```

`SIGTERM`信号表示内核要求当前进程停止，进程可以自行停止，也可以忽略这个信号。

```javascript
    var http = require('http');
    
    var server = http.createServer(function (req, res) {
        // ...
        res.end("kill -s SIGTERM " + process.pid);
    });
    server.listen(8000);
    
    process.on('SIGTERM', function () {
        console.log("收到 SIGTERM 信号");
        server.close(function () {
            console.log("关闭服务");
            process.exit(0);
        });
    });

    // 这里测试，使用 curl 127.0.0.1:8000 
    // 然后，命令行输入  kill -s SIGTERM ***
    // 会显示，关闭服务。之后，退出
    
    // 不要使用浏览器。因为，浏览器会保持长链接，就无法退出。
    // 长链接断开时间为，15s--> 100s,不等。
```

上面代码表示，进程接到`SIGTERM`信号之后，关闭服务器，然后退出进程。
需要注意的是，这时进程不会马上退出，而是要回应完最后一个请求，处理完所有回调函数，然后再退出。

`exit`事件在Node进程退出前触发。

```javascript
process.on('exit', function() {
  console.log('Goodbye');
});
```

### process.kill()

`process.kill`方法用来对指定ID的线程发送信号，默认为`SIGINT`信号。

```javascript
process.kill(process.pid, 'SIGTERM');
```
上面代码用于杀死当前进程。

```js

    process.kill(1339)
    // true
    process.kill(1339)
    // Error: kill ESRCH
    //    at exports._errnoException (util.js:1022:11)
    //    at process.kill (internal/process.js:172:13)
    //    at repl:1:9
    //    at sigintHandlersWrap (vm.js:22:35)
    //    at sigintHandlersWrap (vm.js:96:12)
    //    at ContextifyScript.Script.runInThisContext (vm.js:21:12)
    //    at REPLServer.defaultEval (repl.js:340:29)
    //    at bound (domain.js:280:14)
    //    at REPLServer.runBound [as eval] (domain.js:293:12)
    //    at REPLServer.<anonymous> (repl.js:538:10)
```
    
    这里，展示了 在 开启node 命令行内，可以用个当前的node 服务，去关闭掉其他node服务。


```javascript
    process.on('SIGTERM', function(){
      console.log('terminating');
      process.exit(1);
    });
    
    setTimeout(function(){
        console.log('sending SIGTERM to process %d', process.pid);
        process.kill(process.pid, 'SIGTERM');
    }, 500);
    
    setTimeout(function(){
        console.log('never called');
    }, 1000);
```

上面代码中，500毫秒后向当前进程发送SIGTERM信号（终结进程），因此1000毫秒后的指定事件不会被触发。

## 事件

### exit事件

当前进程退出时，会触发`exit`事件，可以对该事件指定回调函数。

```javascript
    process.on('exit', function () {
      fs.writeFileSync('/tmp/myfile', '需要保存到硬盘的信息');
    });
```

下面是一个例子，进程退出时，显示一段日志。

```javascript
    process.on("exit", code =>
      console.log("exiting with code: " + code))
      
      exiting with code: 0
```

注意，此时回调函数只能执行同步操作，不能包含异步操作，因为执行完回调函数，进程就会退出，无法监听到回调函数的操作结果。

```javascript
    process.on('exit', function(code) {
        // 不会执行
        setTimeout(function() {
            console.log('This will not run');
        }, 0);
    });
```

上面代码在`exit`事件的回调函数里面，指定了一个下一轮事件循环，所要执行的操作。这是无效的，不会得到执行。

### beforeExit事件

beforeExit事件在Node清空了Event Loop以后，再没有任何待处理的任务时触发。正常情况下，如果没有任何待处理的任务，
Node进程会自动退出，设置beforeExit事件的监听函数以后，就可以提供一个机会，再部署一些任务，使得Node进程不退出。

beforeExit事件与exit事件的主要区别是，beforeExit的监听函数可以部署异步任务，而exit不行。

此外，如果是显式终止程序（比如调用process.exit()），或者因为发生未捕获的错误，而导致进程退出，这些场合不会触发beforeExit事件。
因此，不能使用该事件替代exit事件。

### uncaughtException事件

当前进程抛出一个没有被捕捉的错误时，会触发`uncaughtException`事件。

```javascript
process.on('uncaughtException', function (err) {
  console.error('An uncaught error occurred!');
  console.error(err.stack);
  throw new Error('未捕获错误');
});
```

部署`uncaughtException`事件的监听函数，是免于Node进程终止的最后措施，否则Node就要执行`process.exit()`。
【 出于除错的目的，并不建议发生错误后，还保持进程运行】
抛出错误之前部署的异步操作，还是会继续执行。只有完成以后，Node进程才会退出。

```javascript
    process.on('uncaughtException', function(err) {
      console.log('Caught exception: ' + err);
    });
    
    setTimeout(function() {
      console.log('本行依然执行1');
          setTimeout(function() {
            console.log('本行依然执行2');
                setTimeout(function() {
                  console.log('本行依然执行3');
                }, 500);
          }, 500);
    }, 500);
    
    // 下面的表达式抛出错误
    nonexistentFunc();

    输出
        Caught exception: ReferenceError: nonexistentFunc is not defined
        本行依然执行1
        本行依然执行2
        本行依然执行3
        
```

上面代码中，抛出错误之后，此前setTimeout指定的回调函数亦然会执行。

### 信号事件

操作系统内核向Node进程发出信号，会触发信号事件。实际开发中，主要对SIGTERM和SIGINT信号部署监听函数，
这两个信号在非Windows平台会导致进程退出，但是只要部署了监听函数，Node进程收到信号后就不会退出。

```javascript
    // 读取标准输入，这主要是为了不让当前进程退出
    process.stdin.resume();
    
    process.on('SIGINT', function() {
      console.log('SIGINT信号，按Control-D退出');
    });
```

上面代码部署了SIGINT信号的监听函数，当用户按下Ctrl-C后，会显示提示文字。


###
    1 —— process.memoryUsage()
    
    > process.memoryUsage()
    { rss: 21839872, heapTotal: 9472608, heapUsed: 4629616 }
    
        rss: 21839872, 
        heapTotal: 9472608, // V8占用的内容
        heapUsed: 4629616   // V8实际使用了的内存
    
    2 —— process.uptime()    
        当前node进程已经运行了多长时间（单位是秒）
    
    3 —— 当前进程信息
        process.pid：返回进程id。
        process.title：可以用它来修改进程的名字，当你用ps命令，同时有多个node进程在跑的时候，作用就出来了。

    4 —— 用户组/用户 相关
    
        process.seteuid(id)： process.geteuid()：获得当前用户的id。（POSIX平台上才有效）
        process.getgid(id) process.getgid()：获得当前群组的id。（POSIX平台上才有效，群组、有效群组 的区别，请自行谷歌）
        process.setegid(id) process.getegid()：获得当前有效群组的id。（POSIX平台上才有效）
        process.setroups(groups)： process.getgroups()：获得附加群组的id。（POSIX平台上才有效，
        process.setgroups(groups)： process.setgroups(groups)：+
        process.initgroups(user, extra_group)：
        
    5 —— process.hrtime()一般用于做性能基准测试。



## 子进程 (child_process)

    child_process 是Node的一个十分重要的模块，通过它可以实现创建多进程，以利用单机的多核计算资源。
    虽然，Nodejs天生是单线程单进程的，但是有了child_process模块，可以在程序中直接创建子进程，并使用主进程和子进程之间实现通信。
    

### 进程通信

    每个进程各自有不同的用户地址空间，任何一个进程的全局变量在另一个进程中都看不到，
    所以进程之间要交换数据必须通过内核,在内核中开辟一块缓冲区，
    进程1把数据从用户空间拷到内核缓冲区，进程2再从内核缓冲区把数据读走，内核提供的这种机制称为进程间通信。
    进程之间的通信通过共享缓冲区。一个向内写，另一个向内读。

    类型 |    无连接 |   可靠  |   流控制 | 优先级
    ----|---------|------|----------| -----
    普通PIPE |N   |   Y   |  Y        | N
    命名PIPE| N   | Y     |   Y       | N
    消息队列| N | Y     |   Y       | N
    信号量  | N    | Y     |   Y       | Y
    共享存储| N | Y     |   Y       | Y
    UNIX流SOCKET | N | Y     |   Y   | N
    UNIX数据包SOCKET|  Y   |Y  |N      | N


    Node 中实现 IPC 通信的是管道技术，但只是抽象的称呼，具体细节实现由 libuv提供， 在 windows 下由命名管道（named pipe）实现， *nix 系统则采用 Unix Domain Socket实现。 也就是上表中的最后第二个。

    Socket API原本是为网络通讯设计的，但后来在socket的框架上发展出一种IPC机制，就是UNIX Domain Socket。虽然网络socket也可用于同一台主机的进程间通讯（通过loopback地址127.0.0.1），但是UNIX Domain Socket用于IPC更有效率：不需要经过网络协议栈，不需要打包拆包、计算校验和、维护序号和应答等，只是将应用层数据从一个进程拷贝到另一个进程。

    这东西很酷，多年前我就想过这种方式，事实证明，需要多读书。多年前，我就是不够刻苦。即使我具有很多天赋，但是不努力依旧没有意义。


### 创建子进程
    * spawn()启动一个子进程来执行命令
    * exec()启动一个子进程来执行命令, 带回调参数获知子进程的情况, 可指定进程运行的超时时间
    * execFile()启动一个子进程来执行一个可执行文件, 可指定进程运行的超时时间
    * fork() 与spawn()类似, 不同在于它创建的node子进程只需指定要执行的js文件模块即可
    
    ```js
    
        // don't call this example code
        var cp = require('child_process');
        cp.spawn('node', ['work.js']);    

        cp.exec('node work.js', function(err, stdout, stderr) {
            // some code
        });
        
        
        cp.execFile('work.js', function(err, stdout, stderr) {
            // some code
        });

        
        cp.fork('./work.js');
    
    ```


    exec方法会直接调用bash（/bin/sh程序）来解释命令，所以如果有用户输入的参数，exec方法是不安全的。其实，后3种，都是基于第一种进行的扩展。

    * 下面列出来的都是异步创建子进程的方式，每一种方式都有对应的同步版本。
    * `.exec()`、`.execFile()`、`.fork()`底层都是通过`.spawn()`实现的。
    * `.exec()`、`execFile()`额外提供了回调，当子进程停止的时候执行。





## 参考链接

- José F. Romaniello, [Graceful shutdown in node.js](http://joseoncode.com/2014/07/21/graceful-shutdown-in-node-dot-js/)
- https://yjhjstz.gitbooks.io/deep-into-node/content/chapter13/chapter13-1.html
