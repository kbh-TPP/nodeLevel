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
