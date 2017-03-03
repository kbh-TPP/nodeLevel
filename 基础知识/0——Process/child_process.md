# 模块概览

## 在node中，child_process这个模块非常重要。掌握了它，等于在node的世界开启了一扇新的大门


```js

    const spawn = require('child_process').spawn;
    const ls = spawn('ls', ['-lh', '/usr']);
    
    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    
    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

```
    输出
    ls -lh /usr
        total 0
        drwxr-xr-x  1059 root  wheel    35K  2  5 09:51 bin
        drwxr-xr-x   261 root  wheel   8.7K 12 16 10:30 include
        drwxr-xr-x   304 root  wheel    10K  2  5 09:51 lib

    

## 几种创建子进程的方式

    注意事项：
    下面列出来的都是异步创建子进程的方式，每一种方式都有对应的同步版本。
        .exec()、.execFile()、.fork()底层都是通过.spawn()实现的。
        .exec()、execFile()额外提供了回调，当子进程停止的时候执行。




### 1 child_process.exec(command[, options][, callback])
    
    创建一个shell，然后在shell里执行命令。执行完成后，将stdout、stderr作为参数传入回调方法。
    
    例子如下：
        执行成功，error 为 null；执行失败，error 为 Error实例。 error.code为错误码，
        stdout、stderr 为标准输出、标准错误。 默认是字符串，除非 options.encoding 为 buffer

```js

    var exec = require('child_process').exec;
    
    // 成功的例子
    exec('ls -al', function(error, stdout, stderr){
        if(error) {
            console.error('error: ' + error);
            return;
        }
    
        console.log('stdout: ' + stdout, ' typeof stdout :',typeof stdout);
        console.log('stderr: ' + stderr, ' typeof stderr :',typeof stderr);
        console.log();
        console.log();
    });
    
    
    // 失败的例子
    exec('ls hello.txt', function(error, stdout, stderr){
        if(error) {
            console.error('error: ' + error, "typeof error: ", typeof error);
            return;
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    });

```
#### 参数说明：

    cwd：当前工作路径。
    env：环境变量。
    encoding：编码，默认是utf8。
    shell：用来执行命令的shell，unix上默认是/bin/sh，windows上默认是cmd.exe。
    timeout：默认是0。
    killSignal：默认是SIGTERM。
    uid：执行进程的uid。
    gid：执行进程的gid。
    maxBuffer： 标准输出、错误输出最大允许的数据量（单位为字节），如果超出的话，子进程就会被杀死。默认是200*1024（就是200k啦）
    
    备注：
        1、如果timeout大于0，那么，当子进程运行超过timeout毫秒，那么，就会给进程发送killSignal指定的信号（比如SIGTERM）。
        2、如果运行没有出错，那么error为null。如果运行出错，那么，error.code就是退出代码（exist code），error.signal会被设置成终止进程的信号。（比如CTRL+C时发送的SIGINT）



#### 经过代码打印，方法如下。

    var exec = require('child_process').exec;
    console.log(exec.toString());

    var execFile = require('child_process').execFile;
    console.log(execFile.toString());

     【exec】是基于【execFile】改造的，而【execFile】是基于【spawn】实现的

#### 风险项

    传入的命令，如果是用户输入的，有可能产生类似sql注入的风险，比如
    
    exec('ls hello.txt; rm -rf *', function(error, stdout, stderr){
        if(error) {
            console.error('error: ' + error);
            // return;
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    });

### 2 child_process.execFile(file[, args][, options][, callback])

    跟.exec()类似，不同点在于，没有创建一个新的shell。至少有两点影响
        1、比child_process.exec()效率高一些。（实际待测试）
        2、一些操作，比如I/O重定向，文件glob等不支持。
        
    

        如果命令参数是由用户来输入的，对于exec函数来说是有安全性风险的，因为Shell会运行多行命令，
    比如’ls -l .;pwd，如逗号分隔，之后的命令也会被系统运行。但使用exeFile命令时，命令和参数分来，防止了参数注入的安全风险。

```js
    
    // exec
    var cmd = 'ls -l .;pwd'
    var ls = childProcess.exec(cmd, function (error, stdout, stderr) {
       if (error) {
         console.log(error.stack);
         console.log('Error code: '+error.code);
       }
       console.log('Child Process STDOUT: '+stdout);
    });
    
    // execFile
    var path = ".;pwd";
    childProcess.execFile('/bin/ls', ['-l', path], function (err, result) {
        console.log(result)
    });
    
```

### 3 fork
    
    fork方法直接创建一个子进程，执行Node脚本，fork('./child.js') 相当于 spawn('node', ['./child.js']) 。
    与spawn方法不同的是，fork会在父进程与子进程之间，建立一个通信管道，用于进程之间的通信。

```js

// 父进程

    var child_process = require('child_process');
    var n1 = child_process.fork('./child1.js');
    var n2 = child_process.fork('./child2.js');
    
    n1.on('message', function(m) {
    
        console.log('PARENT got message:', m);
    
    });
    
    n2.on('message', function(m) {
    
        console.log('PARENT got message:', m);
    
    });
    
    n1.send({ hello: 'world1' });
    n2.send({ hello: 'world2' });


<!-- node **。js -->


// 线程
    child1.js
    process.on('message', function(m) {
        console.log('CHILD1 got message:', m);
        process.send({ foo: 'child 1' });
    
    });
    
    child2.js
    process.on('message', function(m) {
        console.log('CHILD2 got message:', m);
        process.send({ foo: 'child 2' });
    
    });

```

    输出
        CHILD1 got message: { hello: 'world1' }
        PARENT got message: { foo: 'child 1' }
        CHILD2 got message: { hello: 'world2' }
        PARENT got message: { foo: 'child 2' }
    

    这里运行父进程的时候，会通过【fork】挂起子进程。

    ps -aux | grep node
    
      501 32187 ??         0:00.17 /usr/local/bin/node /记录/Node知识体系/0——Process/child_process.js
      501 32188 ??         0:00.17 /usr/local/bin/node ./child1.js
      501 32189 ??         0:00.18 /usr/local/bin/node ./child2.js

#### fork 之后，父子通信了，酷毙了。


### 3 send
    
    使用 child_process.fork() 生成新进程之后，就可以用 child.send(message, [sendHandle]) 向新进程发送消息。
    新进程中通过监听message事件，来获取消息。

```js

    //parent.js
    var cp = require('child_process');
    var n = cp.fork(__dirname + '/sub.js');
    
    n.on('message', function(m) {
      console.log('PARENT got message:', m);
    });
    
    n.send({ hello: 'world' });

```












