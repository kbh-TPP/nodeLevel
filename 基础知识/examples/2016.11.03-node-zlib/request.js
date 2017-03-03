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


req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});

req.end();
