## HTTP.RES

### 一个web服务程序，接受到来自客户端的http请求后，向客户端返回正确的响应内容，这就是res的职责。

    返回的内容包括：状态代码/状态描述信息、响应头部、响应主体。下文会举几个简单的例子。

```js

    var http = require('http');
    var server = http.createServer(function(req, res){
        res.send('ok');
    });
    server.listen(3000);
```
    
    在下面的例子中，我们同时设置了 状态代码/状态描述信息、响应头部、响应主体，就是这么简单。
    
    
    
## 例子
    
    在下面的例子中，我们同时设置了 状态代码/状态描述信息、响应头部、响应主体，就是这么简单。
    
```js

var http = require('http');

// 设置状态码、状态描述信息、响应主体
var server = http.createServer(function(req, res){
    res.writeHead(200, 'ok', {
        'Content-Type': 'text/plain'
    });
    res.end('hello');
});

server.listen(3000);

```


## 设置状态代码、状态描述信息

    res提供了 res.writeHead()、res.statusCode/res.statusMessage 来实现这个目的。
    举例，如果想要设置 200/ok ，可以

```js
    res.writeHead(200, 'ok');

// 或者
    
    res.statusCode = 200;
    res.statusMessage = 'ok';
    
```

两者差不多，差异点在于
    
    1、res.writeHead() 可以提供额外的功能，比如设置响应头部。
    2、当响应头部发送出去后，res.statusCode/res.statusMessage 会被设置成已发送出去的 状态代码/状态描述信息。
    

## 设置响应头部
    
    res提供了 res.writeHead()、response.setHeader() 来实现响应头部的设置。
    
    举例，比如想把 Content-Type 设置为 text-plain，那么可以
    
    
```js

// 方法一
res.writeHead(200, 'ok', {
    'Content-Type': 'text-plain'
});

// 方法二
res.setHeader('Content-Type', 'text-plain');


```

    两者的差异点在哪里呢？
    
    1、 res.writeHead() 不单单是设置header。
    
    2、 已经通过 res.setHeader() 设置了header，当通过 res.writeHead() 设置同名header，
        res.writeHead() 的设置会覆盖之前的设置。
 
```js

    var http = require('http');
    
    var server = http.createServer( (req, res) => {
    
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200, 'ok', {
            'Content-Type': 'text/plain'    //  覆盖前面的字段
        });
        res.end('hello');
    });
    
    server.listen(3000);

    // 而下面的例子，则直接报错。报错信息为 Error: Can't set headers after they are sent.。

    var http = require('http');
    
    var server = http.createServer(function(req, res){    
        res.writeHead(200, 'ok', {
            'Content-Type': 'text/plain'
        });
        
        res.setHeader('Content-Type', 'text/html');
        res.end('hello');
    });
    
    server.listen(3000);

```
    
### 其他响应头部操作

    增、删、改、查 是配套的。下面分别举例说明下，例子太简单就直接上代码了。
    
    
```js

    // 增
    res.setHeader('Content-Type', 'text/plain');
    
    // 删
    res.removeHeader('Content-Type');
    
    // 改
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Type', 'text/html');  // 覆盖
    
    // 查
    res.getHeader('content-type');

```
    注意：其中略显不同的是 res.getHeader(name)，name 用的是小写，返回值没做特殊处理。
    
    
```js

    res.setHeader('Content-Type', 'TEXT/HTML');
    console.log( res.getHeader('content-type') );  // TEXT/HTML
    
    res.setHeader('Content-Type', 'text/plain');
    console.log( res.getHeader('content-type') );  // text/plain

```

### 设置响应主体
    
    主要用到 res.write() 以及 res.end() 两个方法。
    res.write() API的信息量略大，建议看下官方文档。
    
#### response.write(chunk [, encoding] [, callback])

    chunk：响应主体的内容，可以是string，也可以是buffer。当为string时，encoding参数用来指明编码方式。（默认是utf8）
    encoding：编码方式，默认是 utf8。
    callback：当响应体flushed时触发。（TODO 这里想下更好的解释。。。）
    
    使用上没什么难度，只是有些注意事项：

    如果 res.write() 被调用时， res.writeHead() 还没被调用过，那么，就会把header flush出去。
    res.write() 可以被调用多次。
    当 res.write(chunk) 第一次被调用时，node 会将 header 信息 以及 chunk 发送到客户端。
    第二次调用 res.write(chunk) ，node 会认为你是要streaming data（WTF，该怎么翻译）。。。


#### response.end([data][, encoding][, callback])

    掌握了 res.write() 的话，res.end() 就很简单了。
    res.end() 的用处是告诉nodejs，header、body都给你了，这次响应就到这里吧。
    有点像个语法糖，可以看成下面两个调用的组合。至于callback，当响应传递结束后触发。

    
```js

    res.write(data, encoding);
    res.end();

```



### chunk数据

    参考这里：http://stackoverflow.com/questions/6258210/how-can-i-output-data-before-i-end-the-response    
    也就是说，除了nodejs的特性，还需要了解 HTTP协议、浏览器的具体实现。（细思极恐）



### 超时处理
    
    接口：response.setTimeout(msecs, callback)
    关于 timeout 事件的说明，同样是言简意赅（WTF），话少信息量大，最好来个demo TODO
    
```js
    
    var http = require('http');
    
    var server = http.createServer( (req, res) => {
    
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200, 'ok', {
            'Content-Type': 'text/plain'    //  覆盖前面的字段
        });
    
        console.log(response.headersSent);
        
        res.setTimeout(3000, function () {

            console.log(response.headersSent);

            console.log('set time out');
            res.end('set time out \n');
        });
    
        // res.end('hello');
    });
    
    server.listen(3000);


```
    输入 curl www.qq.com:3000 
    3s 之后，执行 【setTimeout】的回调函数。

    
    
### 其他不常用属性/方法
    
    
    1、response.finished：一开始是false，响应结束后，设置为true。
    
    2、response.sendDate：默认是true。是否自动设置Date头部。（按HTTP协议是必须要的，除非是调试用，不然不要设置为false）
    
    3、response.headersSent：只读属性。响应头部是否已发送。
    
    4、response.writeContinue()：发送 HTTP/1.1 100 Continue 消息给客户端，
    提示说服务端愿意接受客户端的请求，请继续发送请求正文（body)。（TODO 做个demo啥的是大大的好）
    
    
```js

    var http = require('http');
    
    var server = http.createServer( (req, res) => {
    
        res.setHeader('Content-Type', 'text/html');
        console.log(res.headersSent);       // false
    
        res.writeHead(200, 'ok', {
            'Content-Type': 'text/plain'    //  覆盖前面的字段
        });
        
        console.log(res.headersSent);       // true
    
        res.end('hello');
    });
    
    server.listen(3000);


```    
    
    
    
    
    
    
    
    