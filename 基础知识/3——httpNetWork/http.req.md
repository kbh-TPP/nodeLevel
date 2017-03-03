## 概览

本文的重点会放在`req`这个对象上。前面已经提到，它其实是http.IncomingMessage实例，在服务端、客户端作用略微有差异

* 服务端处：获取请求方的相关信息，如request header等。
* 客户端处：获取响应方返回的相关信息，如statusCode等。

服务端例子：

```js
// 下面的 req
var http = require('http');
var server = http.createServer(function(req, res){
    console.log(req.headers);
    // 如果只使用 send，不使用end，服务端会挂. 
    // res.send("ok");
    res.end('ok');
});
server.listen(3000);
```
    用浏览器访问 服务端输出
    {
        host: '127.0.0.1:3000',
        connection: 'keep-alive',
        pragma: 'no-cache',
        'cache-control': 'no-cache',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
        accept: 'image/webp,image/*,*/*;q=0.8',
        referer: 'http://127.0.0.1:3000/',
        'accept-encoding': 'gzip, deflate, sdch, br',
        'accept-language': 'en-US,en;q=0.8,pl;q=0.6,zh-CN;q=0.4,zh-TW;q=0.2',
        cookie: 'fingerprint=1812449954; __utma=96992031.1250987093.1462978767.1463037970.1484111818.7; __utmz=96992031.1484111818.7.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); Hm_lvt_fffba4526d43301ecb10cceaf968f17d=1484216432'
    }

客户端例子 1

```js
// 下面的res
var http = require('http');
http.get('http://127.0.0.1:3000', function (res) {

    console.log(res.statusCode);
});
```
    服务端输出
    { host: '127.0.0.1:3000', connection: 'close' }
    
    客户端
    200



## 属性/方法/事件 分类

http.IncomingMessage的 属性/方法/事件 不是特别多，按照是否 客户端/服务端 特有的，下面进行简单归类。可以看到

* 服务端处特有：url
* 客户端处特有：statusCode、statusMessage

| 类型      |     名称 |   服务端   |  客户端  |
| :-------- | :--------:| :------: | :---: |
| 事件    |   aborted |  ✓  |   ✓   |
| 事件    |   close |  ✓  |   ✓   |
| 属性    |   headers |  ✓  |   ✓   |
| 属性    |   rawHeaders |  ✓  |   ✓   |
| 属性    |   statusCode |  ✕  |   ✓   |
| 属性    |   statusMessage |  ✕  |   ✓   |
| 属性    |   httpVersion |  ✓  |   ✓   |
| 属性    |   httpVersion |  ✓  |   ✓   |
| 属性    |   url |  ✓  |   ✕   |
| 属性    |   socket |  ✓  |   ✓   |      这个socket
| 方法    |   .destroy() |  ✓  |   ✓   |
| 方法    |   .setTimeout() |  ✓  |   ✓   |



```js

var net = require('net');
var http = require('http');
http.get('http://127.0.0.1:3000', function (res) {
    console.log(res.socket instanceof net.Socket);
});


    输出 
        true 
    这里论证  res socket 是继承自 net模块的Socket方法
    
```

## 服务端的例子

### 例子一：获取httpVersion/method/url

下面是一个典型的HTTP请求报文，里面最重要的内容包括：HTTP版本、请求方法、请求地址、请求头部。

```http
GET /hello HTTP/1.1
Host: 127.0.0.1:3000
Connection: keep-alive
Cache-Control: no-cache
```

那么，如何获取上面提到的信息呢？很简单，直接上代码

```js
// getClientInfo.js
var http = require('http');

var server = http.createServer(function(req, res){
    console.log( '1、客户端请求url：' + req.url );
    console.log( '2、http版本：' + req.httpVersion );
    console.log( '3、http请求方法：' + req.method );
    console.log( '4、http请求头部' + JSON.stringify(req.headers) );

    res.end('ok');
});

server.listen(3000);
```

效果如下：

```bash

浏览器输入 www.qq.com/index.html

1、客户端请求url：/index.html
2、http版本：1.1
3、http请求方法：GET
4、http请求头部{"host":"www.qq.com:3000","connection":"keep-alive","cache-control":"max-age=0","upgrade-insecure-requests":"1","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36","accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8","accept-encoding":"gzip, deflate, sdch","accept-language":"en-US,en;q=0.8,pl;q=0.6,zh-CN;q=0.4,zh-TW;q=0.2","cookie":"tvfe_boss_uuid=b96134f43b387629; 3g_guest_id=-8952967162465562624; ts_uid=9352826780; rtx=haigecao; rtxid=800f2af411ab221c739e9bfacdb61892; mobileUV=1_15922f38095_dc38a; sdi_stat_uid=f2285bf9-7552-4a13-af43-d2b1d9732af1; Hm_lvt_fffba4526d43301ecb10cceaf968f17d=1484313150; luin=o0457611536; lskey=0001000065c68960f1752e0669fd5e1d1152b3cf0380511ee5752e499307bf06503b9b69a3d47b0e6cdcb698; eas_sid=g1l4H8P6F118A5B1Z7q3Y6w0a8; pgv_pvi=5547755520; RK=YOdug9RuVt; pgv_info=ssid=s1798094222; pgv_pvid=1238528383; o_cookie=457611536; pt2gguin=o0457611536; uin=o0457611536; skey=M9iEtmZ7di; ptisp=ctc; ptcz=fefc984c6777ff28fe910e47794c8e3b9bd4e2fc833acf77591690ca67c42795; qv_swfrfh=km.oa.com; qv_swfrfc=v20; qv_swfrfu=http://km.oa.com/group/2013/articles/show/295261"}

```

### 例子二：获取get请求参数

服务端代码如下：

```js
// getClientGetQuery.js
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res){
    var urlObj = url.parse(req.url);
    var query = urlObj.query;
    var queryObj = querystring.parse(query);
     
    
    console.log( JSON.stringify(queryObj) );
    console.log("urlObj", urlObj);
    
    res.end('ok');
});

server.listen(3000);
```

访问地址 http://www.qq.com:3000/index.html?hg=test&wj=123

服务端输出如下

```bash
{"hg":"test","wj":"123"}

1 —— 这里引出了 url 组建，虽然比较简单
    urlObj =  Url {
      protocol: null,
      slashes: null,
      auth: null,
      host: null,
      port: null,
      hostname: null,
      hash: null,
      search: '?hg=test&wj=123',
      query: 'hg=test&wj=123',
      pathname: '/index.html',
      path: '/index.html?hg=test&wj=123',
      href: '/index.html?hg=test&wj=123' }

2 —— 这里引出了一个问题，
    listen(80) 会发生什么，为什么？

```

### 例子三：获取post请求参数

服务端代码如下

```js
// getClientPostBody.js
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res){
    
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

通过curl构造post请求：

```bash

curl -d 是post 方式
curl -s 静默方式，不现实错误，除了-d，其他默认是GET方式

curl -d 'haige=hello&wj=world' http://127.0.0.1:3000
```

服务端打印如下：

```bash

post body is: haige=hello&wj=world

```

备注：post请求中，不同的`Content-type`，post body有不小差异，感兴趣的同学可以研究下。

本例中的post请求，HTTP报文大概如下

```http
POST / HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/x-www-form-urlencoded
Cache-Control: no-cache

nick=casper&hello=world
```

## 客户端处例子

### 例子一：获取httpVersion/statusCode/statusMessage

代码如下：

```js
var http = require('http');
var server = http.createServer(function(req, res){
    res.writeHead(200, {'content-type': 'text/plain',});
    res.end('from server');
});
server.listen(3000);

var client = http.get('http://127.0.0.1:3000', function(res){
    console.log('1、http版本：' + res.httpVersion);
    console.log('2、返回状态码：' + res.statusCode);
    console.log('3、返回状态描述信息：' + res.statusMessage);
    console.log('4、返回正文：');

    res.pipe(process.stdout);
});
```

控制台输出：

```bash
1、http版本：1.1
2、返回状态码：200
3、返回状态描述信息：OK
4、返回正文：
from server
```

## 事件对比：aborted、close

官方文档对这两个事件的解释是：当客户端终止请求时，触发aborted事件；当客户端连接断开时，触发close事件；官方文档传送们：[地址](https://nodejs.org/api/http.html#http_event_aborted_1)

解释得比较含糊，从实际实验对比上来看，跟官方文档有不小出入。此外，客户端处、服务端处的表现也是不同的。

### 服务端表现

根据实际测试结果来看，当客户端：

* abort请求时，服务端req的aborted、close事件都会触发；（诡异）
* 请求正常完成时，服务端req的close事件不会触发；（也很诡异）

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
```

以下代码来自nodejs源码（_http_server.js）

```js
  function abortIncoming() {
    while (incoming.length) {
      var req = incoming.shift();
      req.emit('aborted');
      req.emit('close');
    }
    // abort socket._httpMessage ?
  }
```

再来一波对比，`req.on('close')`和`req.socket.on('close')`。

```js
// reqSocketClose.js
var http = require('http');

var server = http.createServer(function(req, res){
    
    console.log('server: 收到客户端请求');
    
    req.on('close', function(){
        console.log('server: req close');
    });
    
    req.socket.on('close', function(){
        console.log('server: req.socket close');
    });    
    
    res.end('ok'); 
});

server.listen(3000);

var client = http.get('http://127.0.0.1:3000/aborted', function(res){
    console.log('client: 收到服务端响应');
});
```

输出如下，正儿八经的close事件触发了。

```bash
server: 收到客户端请求
server: req.socket close
client: 收到服务端响应
```

### 客户端表现

猜测客户端的aborted、close也是在类似场景下触发，测试代码如下。发现一个比较有意思的情况，`res.pipe(process.stdout)` 这行代码是否添加，会影响`close`是否触发。

* 没有`res.pipe(process.stdout)`：close不触发。
* 有`res.pipe(process.stdout)`：close触发。

```js
var http = require('http');

var server = http.createServer(function(req, res){
    
    console.log('1、服务端：收到客户端请求');
    
    res.flushHeaders();
    res.setTimeout(100);    // 故意不返回，3000ms后超时
});


server.on('error', function(){});

server.listen(3000, function(){

    var client = http.get('http://127.0.0.1:3000/aborted', function(res){

        console.log('2、客户端：收到服务端响应');

        // res.pipe(process.stdout); 注意这行代码
        
        res.on('aborted', function(){
            console.log('3、客户端：aborted触发！');
        });

        res.on('close', function(){
            console.log('4、客户端：close触发！');
        });     
    });
});
```

## 信息量略大的 .destroy()

经过前面aborted、close的摧残，本能的觉得 .destroy() 方法的表现会有很多惊喜之处。

测试代码如下：

```js
var http = require('http');

var server = http.createServer(function(req, res){
    
    console.log('服务端：收到客户端请求');
    
    req.destroy(new Error('测试destroy'));
    
    req.on('error', function(error){
        console.log('服务端：req error: ' + error.message);
    });
    
    req.socket.on('error', function(error){
        console.log('服务端：req socket error: ' + error.message);
    })
});

server.on('error', function(error){
    console.log('服务端：server error: ' + error.message);
});

server.listen(3000, function(){

    var client = http.get('http://127.0.0.1:3000/aborted', function(res){
        // do nothing
    });

    client.on('error', function(error){
        console.log('客户端：client error触发！' + error.message);
    });
});
```

输出如下。根据 .destroy() 调用的时机不同，error 触发的对象不同。（测试过程比较枯燥，有时间再总结一下）

```bash
服务端：收到客户端请求
服务端：req socket error: 测试destroy
客户端：client error触发！socket hang up
```

## 不常用属性

* rawHeaders：未解析前的request header。
* trailers：在分块传输编码(chunk)中用到，表示trailer后的header可分块传输。（感兴趣的可以研究下）
* rawTrailers：

关于trailers属性：
>The request/response trailers object. Only populated at the 'end' event.

## 写在后面

一个貌似很简单的对象，实际比想的要复杂一些。做了不少对比实验，也发现了一些好玩的东西，打算深入学习的同学可以自己多动手尝试一下 :)

TODO：

1. 对close、aborted进行更深入对比
2. 对.destroy()进行更深入对比

## 相关链接

官方文档：
https://nodejs.org/api/http.html#http_class_http_incomingmessage