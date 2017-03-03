## http服务端

### 创建server

```js

    var http = require('http');

    var requestListener = function(req, res){
        res.end('ok');
    };

    var server = http.createServer(requestListener);
    // var server = new http.Server(requestListener); 跟上面是等价的
    server.listen(3000);

```

### 获取请求方信息

    HTTP版本、HTTP method、headers、url
    
```js

    var http = require('http');
    
    var server = http.createServer(function(req, res){
        console.log('客户端请求url：' + req.url);
        console.log('http版本：' + req.httpVersion);
        console.log('http请求方法：' + req.method);
    
        res.end('ok');
    });
    
    server.listen(3000);

```

    输出： 
        客户端请求url：/index.html
        http版本：1.1
        http请求方法：GET


### 获取get请求参数

```js

    var http = require('http');
    var url = require('url');
    var querystring = require('querystring');
    
    var server = http.createServer(function(req, res){
        var urlObj = url.parse(req.url);
        var query = urlObj.query;
        var queryObj = querystring.parse(query);
    
        console.log( JSON.stringify(queryObj) );
    
        res.end('ok');
    });
    
    server.listen(3000);



```
    测试
        curl http://127.0.0.1:3000/hello\?hg=wj&OK=error


    输出：
        {"hg":"wj","OK":"error"}


### 获取post请求参数

```js

var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res){

    console.log(JSON.stringify(res.headers) + "\n");

    var body = '';  
    req.on('data', function(thunk){
        body += thunk;
    });

    req.on('end', function(){
        console.log( 'post body is: ' + body );
        res.end('ok');
    }); 
});

server.listen(3000);

```

    模拟post请求
        curl -d 'hg=wj&OK=error' http://127.0.0.1:3000
    
    输出
        {
            "host":"127.0.0.1:3000",
            "user-agent":"curl/7.51.0",
            "accept":"*/*",
            "content-length":"23",
            "content-type":"application/x-www-form-urlencoded"
        }
        post body is: nick=casper&hello=world


### 客户端处例子

    例子一：获取httpVersion/statusCode/statusMessage
    
 ```js

    var http = require('http');
    var server = http.createServer(function (req, res) {
        res.writeHead(200, {'content-type': 'text/plain',});
        res.end('from server');
    });
    server.listen(3000);
    
    var client = http.get('http://127.0.0.1:3000', function (res) {
        console.log('1、http版本：' + res.httpVersion);
        console.log('2、返回状态码：' + res.statusCode);
        console.log('3、返回状态描述信息：' + res.statusMessage);
        console.log('4、返回正文：');
    
        res.pipe(process.stdout);
    });
    
    //控制台输出：
        // 1、http版本：1.1
        // 2、返回状态码：200
        // 3、返回状态描述信息：OK
        // 4、返回正文：from server

```

### 事件对比：aborted、close

    官方文档对这两个事件的解释是：当客户端终止请求时，触发aborted事件；当客户端连接断开时，触发close事件；官方文档传送们：地址
    解释得比较含糊，从实际实验对比上来看，跟官方文档有不小出入。此外，客户端处、服务端处的表现也是不同的。
    
#### 服务端表现
    
    根据实际测试结果来看，当客户端：
       
        abort请求时，服务端req的aborted、close事件都会触发；（诡异）
        请求正常完成时，服务端req的close事件不会触发；（也很诡异）
        直接扒了下nodejs的源代码，发现的确是同时触发的，触发场景：请求正常结束前，客户端abort请求。
    
    测试代码如下：

```js


    var http = require('http');
    
    var server = http.createServer(function(req, res){
    
        console.log('1、收到客户端请求: ' + req.url);
    
        req.on('aborted', function(){
            console.log('2、客户端请求aborted');
        });
    
        req.on('close', function(){
            console.log('3、客户端请求close');
        });
    
        // res.end('ok'); 故意不返回，等着客户端中断请求
    });
    
    server.listen(3000, function(){
        var client = http.get('http://127.0.0.1:3000/aborted');
        setTimeout(function(){
            client.abort();  // 故意延迟100ms，确保请求发出
        }, 100);    
    });
    
    
    // 输出如下
        // 1、收到客户端请求: /aborted
        // 2、客户端请求aborted
        // 3、客户端请求close

    
    【注意】—— client.abort() 使用的时候，会报错。
        
        events.js:160
              throw er; // Unhandled 'error' event
              ^
        
        Error: socket hang up
            at createHangUpError (_http_client.js:254:15)
            at Socket.socketCloseListener (_http_client.js:286:23)
            at emitOne (events.js:101:20)
            at Socket.emit (events.js:188:7)
            at TCP._handle.close [as _onclose] (net.js:498:12)
    
```
    


### 枯燥的事件
    
    首先，我们来看下有哪些事件    
    checkContinue、checkExpectation、clientError、close、connect、connection、request、upgrade
    
error

```js

    var http = require('http');
    var PORT = 3000;
    var noop = function(){};
    
    var svr = http.createServer(noop);
    var anotherSvr = http.createServer(noop);
    
    anotherSvr.on('error', function(e){
        console.error('出错啦！' + e.message);
    });
    
    svr.listen(PORT, function(){
        anotherSvr.listen(PORT);
    });

```

    运行代码，输出如下
    
    出错啦！listen EADDRINUSE :::3000


### connect vs connection

    两者差别非常大，虽然字眼看着有点像。
    
    connect：当客户端的HTTP method为connect时触发。
    connection：当TCP连接建立时触发，大部分时候可以忽略这个事件（目测模块内部自己用到而已）。
    此外，可以通过 req.connection 来获取这个socket（从nodejs源码来看，req.socket、req.connection 都指向了这个socket）。
    此外，socket上的readable事件不会触发（具体原因请看模块内部实现，反正我是还没研究）

    
```js

    var http = require('http');
    var PORT = 3000;
    var noop = function(){};
    
    var svr = http.createServer(noop);
    var anotherSvr = http.createServer(noop);
    
    anotherSvr.on('error', function(e){
        console.error('出错啦！' + e.message);
    });
    
    svr.listen(PORT, function(){
        anotherSvr.listen(PORT);
    });

```


### request
    
    当有新的连接到来时触发。那跟 connection 有什么区别呢？
    好了，keep-alive闪亮登场！在持久化连接的情况下，多个 request 可能对应的是 一个 connection。
    先来看下没有keep-alive的场景


```js


    var http = require('http');
    var PORT = 3000;
    var requestIndex = 0;
    var connectionIndex = 0;
    
    var server = http.createServer(function(req, res){
        res.end('ok');
    });
    
    server.on('request', function(req, res){
        requestIndex++;
        console.log('request event: 第'+ requestIndex +'个请求！');
    });
    
    server.on('connection', function(req, res){
        connectionIndex++;
        console.log('connection event: 第'+ connectionIndex +'个请求！');
    });
    
    server.listen(PORT);

```    
    
    通过curl连续发送3个请求，看下效果
            
        for i in `seq 1 3`; do curl http://127.0.0.1:3000; done

    服务端输出如下
    
        connection event: 第1个请求！
        request event: 第1个请求！
        connection event: 第2个请求！
        request event: 第2个请求！
        connection event: 第3个请求！
        request event: 第3个请求！

    然后，再来看下有keep-alive的场景。用 postman 构造包含 keep-alive 的请求，最终的HTTP请求报文如下
    
    GET / HTTP/1.1
    Host: 127.0.0.1:3000
    Connection: keep-alive
    Cache-Control: no-cache
    Postman-Token: 6027fda7-f936-d3ac-e54f-dafcbf5e58ff

    连续发送3个请求，服务端打印日志如下
    
    connection event: 第1个请求！
    request event: 第1个请求！
    request event: 第2个请求！
    request event: 第3个请求！




### 不常用接口
    
#### server.close([callback]);

    关闭服务器。其实就是 (new net.Server()).close()，停止接受新的连接。 已经连接上的请求会继续处理，当所有连接结束的时候，
    server 正式关闭，并抛出 close 事件。 一般提供了callback，就不用监听close; 监听了close，就不用添加callback。


#### 其他server.listen()
    其实除了 server.listen(PORT) 这种监听方式外，还有以下几种相对不那么常用的监听方式。用到的时候看看文档就行了。
    
    server.listen(handle[, callback])：监听本地文件描述符（fd）（windows不支持），
    或者server，或者socket server.listen(path[, callback])：监听本地socket，创建一个 UNIX socket server 。 
    server.listen([port][, hostname][, backlog][, callback])


















