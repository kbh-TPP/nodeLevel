## 概览

做过web性能优化的同学，对性能优化大杀器**gzip**应该不陌生。浏览器向服务器发起资源请求，比如下载一个js文件，服务器先对资源进行压缩，再返回给浏览器，以此节省流量，加快访问速度。

浏览器通过HTTP请求头部里加上**Accept-Encoding**，告诉服务器，“你可以用gzip，或者defalte算法压缩资源”。

>Accept-Encoding:gzip, deflate

那么，在nodejs里，是如何对资源进行压缩的呢？答案就是**Zlib**模块。

## 入门实例：简单的压缩/解压缩

### 压缩的例子

非常简单的几行代码，就完成了本地文件的gzip压缩。

```javascript
var fs = require('fs');
var zlib = require('zlib');

var gzip = zlib.createGzip();

var inFile = fs.createReadStream('./extra/fileForCompress.txt');
var out = fs.createWriteStream('./extra/fileForCompress.txt.gz');

inFile.pipe(gzip).pipe(out);
```

### 解压的例子

同样非常简单，就是个反向操作。

```javascript
var fs = require('fs');
var zlib = require('zlib');

var gunzip = zlib.createGunzip();

var inFile = fs.createReadStream('./extra/fileForCompress.txt.gz');
var outFile = fs.createWriteStream('./extra/fileForCompress1.txt');

inFile.pipe(gunzip).pipe(outFile);
```

## 服务端gzip压缩

代码超级简单。首先判断 是否包含 **accept-encoding** 首部，且值为**gzip**。

* 否：返回未压缩的文件。
* 是：返回gzip压缩后的文件。

```javascript
var http = require('http');
var zlib = require('zlib');
var fs = require('fs');
var filepath = './extra/fileForGzip.html';

var server = http.createServer(function(req, res){
    var acceptEncoding = req.headers['accept-encoding'];
    var gzip;
    
    if(acceptEncoding.indexOf('gzip')!=-1){ // 判断是否需要gzip压缩
        
        gzip = zlib.createGzip();
        
        // 记得响应 Content-Encoding，告诉浏览器：文件被 gzip 压缩过
        res.writeHead(200, {
            'Content-Encoding': 'gzip'
        });
        fs.createReadStream(filepath).pipe(gzip).pipe(res);
    
    }else{

        fs.createReadStream(filepath).pipe(res);
    }

});

server.listen('3000');
```

## 服务端字符串gzip压缩

代码跟前面例子大同小异。这里采用了**slib.gzipSync(str)**对字符串进行gzip压缩。

```javascript
var http = require('http');
var zlib = require('zlib');

var responseText = 'hello world';

var server = http.createServer(function(req, res){
    var acceptEncoding = req.headers['accept-encoding'];
    if(acceptEncoding.indexOf('gzip')!=-1){
        res.writeHead(200, {
            'content-encoding': 'gzip'
        });
        res.end( zlib.gzipSync(responseText) );
    }else{
        res.end(responseText);
    }

});

server.listen('3000');
```

###写了一个demo，可以实现服务器和客户端之间的gzip压缩传递
   
#### 服务器
    var http = require('http');
    var zlib = require('zlib');
    
    var responseText = 'hello world';
    
    var server = http.createServer(function (req, res) {
        try {
            var acceptEncoding = req.headers['accept-encoding'];
            console.log("req.headers = ", req.headers, "acceptEncoding = ", acceptEncoding);
    
            if (typeof acceptEncoding != "undefined" && acceptEncoding.indexOf('gzip') != -1) {
                res.writeHead(200, {
                    'content-encoding': 'gzip'
                });
    
                console.log(" 收到了 gzip 压缩命令，压缩传输 ", zlib.gzipSync(responseText));
                res.end(zlib.gzipSync(responseText));
    
            } else {
                console.log("没有 收到 gzip 头，返回非压缩的字符串。");
                res.end(responseText);
            }
    
        } catch (error) {
            console.log("error", error);
        }
    
    
    });
    
    server.listen('3100');
    
####客户端

    var http = require('http');
    var zlib = require('zlib');
    
    var options = {
        "hostname": "www.qq.com",
        "port": 3100,
        "method": 'GET',
        headers: {
            // 可选，如果去掉，这样，服务端，就不会传送压缩文件过来
            'accept-encoding': 'gzip',
            'Content-Type':'application/x-www-form-urlencoded'
        }
    };
    
    
    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        var contentEncoding = res.headers["content-encoding"];
    
        // 通过头判断 压缩协议，看是否解析
        if (typeof contentEncoding != "undefined" && contentEncoding.indexOf("gzip") != -1) {
    
            res.on('data', function (chunk) {
                // chunk = zlib.gunzipSync(chunk);
                console.log('BODY contentEncoding data: ' + zlib.gunzipSync(chunk));
            });
        } else {
            res.on('data', function (chunk) {
                // chunk = zlib.gunzipSync(chunk);
                console.log('BODY data: ' + chunk);
            });
        }
    
    });
    
    
#### 测试

    1) —— node http.js
    req.headers =  { 
        'accept-encoding': 'gzip',
        'content-type': 'application/x-www-form-urlencoded',
        host: 'www.qq.com:3100',
        connection: 'close' 
    } 
    acceptEncoding =  gzip
    
    收到了 gzip 压缩命令，压缩传输  <Buffer 1f 8b 08 00 00 00 00 00 00 03 cb 48 cd c9 c9 57 28 cf 2f ca 49 01 00 85 11 4a 0d 0b 00 00 00>

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    2) —— node request.js
    STATUS: 200
    HEADERS: {"content-encoding":"gzip","date":"Mon, 20 Feb 2017 10:00:27 GMT","connection":"close","transfer-encoding":"chunked"}
    BODY contentEncoding data: hello world


## 写在后面

deflate压缩的使用也差不多，这里就不赘述。更多详细用法可参考[官方文档](https://nodejs.org/api/zlib.html#zlib_class_options)。