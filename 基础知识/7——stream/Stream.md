# Stream 流

    从早先的unix开始，stream便开始进入了人们的视野，在过去的几十年的时间里，它被证明是一种可依赖的编程方式，
    它可以将一个大型的系统拆成一些很小的部分，并且让这些部分之间完美地进行合作。在unix中，我们可以使用|符号来实现流。
    在node中，node内置的stream模块已经被多个核心模块使用，同时也可以被用户自定义的模块使用。
    和unix类似，node中的流模块的基本操作符叫做.pipe()，同时你也可以使用一个后压机制来应对那些对数据消耗较慢的对象。

## 为什么应该使用流

    在node中，I/O都是异步的，所以在和硬盘以及网络的交互过程中会涉及到传递回调函数的过程。你之前可能会写出这样的代码：

```js

    var http = require('http');
    var fs = require('fs');

    var server = http.createServer(function (req, res) {
        fs.readFile(__dirname + 'data.txt', function (err, data) {
            res.end(data);
        });
    });
    server.listen(8000);
    
```
    上面的这段代码并没有什么问题，但是在每次请求时，我们都会把整个data.txt文件读入到内存中，然后再把结果返回给客户端。想想看，
    如果data.txt文件非常大，在响应大量用户的并发请求时，程序可能会消耗大量的内存，这样很可能会造成用户连接缓慢的问题。
    
    其次，上面的代码可能会造成很不好的用户体验，因为用户在接收到任何的内容之前首先需要等待程序将文件内容完全读入到内存中。
    
    所幸的是，(req,res)参数都是流对象，这意味着我们可以使用一种更好的方法来实现上面的需求：
    
```js

    var http = require('http');
    var fs = require('fs');

    var server = http.createServer(function (req, res) {
        var stream = fs.createReadStream(__dirname + '/data.txt');
        stream.pipe(res);
    });
    server.listen(8000);

```
    在这里，.pipe()方法会自动帮助我们监听data和end事件。上面的这段代码不仅简洁，
    而且data.txt文件中每一小段数据都将源源不断的发送到客户端。
    
    除此之外，使用.pipe()方法还有别的好处，比如说它可以自动控制后端压力，
    以便在客户端连接缓慢的时候node可以将尽可能少的缓存放到内存中。

### 想要将数据进行压缩？我们可以使用相应的流模块完成这项工作!

```js
    var http = require('http');
    var fs = require('fs');
    var oppressor = require('oppressor');

    var server = http.createServer(function (req, res) {
        var stream = fs.createReadStream(__dirname + '/data.txt');
        stream.pipe(oppressor(req)).pipe(res);
    });
    server.listen(8000);
```

    通过上面的代码，我们成功的将发送到浏览器端的数据进行了gzip压缩。我们只是使用了一个oppressor模块来处理这件事情。
    一旦你学会使用流api，你可以将这些流模块像搭乐高积木或者像连接水管一样拼凑起来，
    从此以后你可能再也不会去使用那些没有流API的模块获取和推送数据了。


### 流模块基础
    
    nodejs 底层一共提供了4个流， Readable 流、Writable 流、Duplex 流和 Transform 流。

    使用情景 |	类 | 	需要重写的方法
    -------| ------| -------------
    只读 |	Readable| 	_read
    只写	| Writable	| _write
    双工	| Duplex |	_read, _write
    操作被写入数据，然后读出结果|	Transform|	_transform, _flush



    pipe

    无论哪一种流，都会使用.pipe()方法来实现输入和输出。.pipe()函数很简单，
    它仅仅是接受一个源头src并将数据输出到一个可写的流dst中： src.pipe(dst)
    .pipe(dst) 将会返回dst因此你可以链式调用多个流:
    
    
    a.pipe(b).pipe(c).pipe(d) 
    
    等价于
    
    a.pipe(b);
    b.pipe(c);
    c.pipe(d);


### readable流
    Readable流可以产出数据，你可以将这些数据传送到一个writable，transform或者duplex流中，只需要调用pipe()方法:
        readableStream.pipe(dst)
        
```js
    var Readable = require('stream').Readable;
    
    var rs = new Readable;
    rs.push('beep ');
    rs.push('boop\n');
    rs.push(null);      // 要以这个结尾
    
    rs.pipe(process.stdout);
    
    // 在上面的代码中rs.push(null)的作用是告诉rs输出数据应该结束了。

```








