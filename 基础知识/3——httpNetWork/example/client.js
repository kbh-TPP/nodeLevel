// "use strict";
//
// var querystring = require("querystring");
// var http = require("http");
//
// var postData = querystring.stringify({
//     'msg': 'Hello World!'
// });
//
// var options = {
//     // hostname: 'km.oa.com',
//     hostname: "http://www.google.com",
//     // hostname: '74.125.204.99',
//     // hostname: '127.0.0.1',
//     // port: 80,
//     family: 4,
//     path: "/",
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         // 'Content-Length': Buffer.byteLength(postData)
//     }
// };
//
// var req = http.request(options, function(res) {
//     console.log(`STATUS: ${res.statusCode}`);
//     console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//
//     res.setEncoding('utf8');
//     res.on('data', function (chunk){
//         console.log(`BODY: ${chunk}`);
//     });
//     res.on('end', function(){
//         console.log('No more data in response.');
//     });
// });
//
//
// req.on('error', function(e){
//         console.log(`problem with request: ${e.message}`);
// });
//
// // write data to request body
// req.write(postData);
// req.end();


// var http = require('http');
// var options = {
//     protocol: 'http:',
//     hostname: 'www.qq.com',
//     port: '3000',
//     path: '/',
//     method: 'GET'
// };
//
// var client = http.request(options, function (res) {
//     var data = '';
//     res.setEncoding('utf8');                // 设定编码方式
//
//     res.on('data', function (chunk) {       // 有数据就继续添加
//         data += chunk;
//     });
//
//     res.on('end', function () {
//         console.log(data);
//     });
// });
//
// client.end();

// var http = require('http');
//
// http.get('http://www.qq.com:3000', function(res){
//     var data = '';
//     res.setEncoding('utf8');
//     res.on('data', function(chunk){
//         data += chunk;
//     });
//     res.on('end', function(){
//         console.log(data);
//     });
// });


// var http = require('http');
// var querystring = require('querystring');
//
// var createClientPostRequest = function(){
//
//     // 发送给服务端的数据
//     var postData = querystring.stringify({
//         title: 'hgwj'
//     });
//
//
//     var options = {
//         method: 'POST',
//         protocol: 'http:',
//         hostname: '127.0.0.1',
//         port: '3000',
//         path: '/post',
//         data: postData,
//         headers: {
//             "connection": "keep-alive",
//             "content-type": "application/x-www-form-urlencoded",
//             'Content-Length': postData.length
//         }
//     };
//
//     var mianData = {
//         "main": "old times"
//     };
//
//
//     // 创建客户端请求
//     var client = http.request(options, function(res){
//         // 最终输出：Server got client data: nick=chyingp
//         res.pipe(process.stdout);
//
//
//     });
//
//     // 发送的报文主体，记得先用 querystring.stringify() 处理下
//     client.write( querystring.stringify(mianData) );
//     client.end();
//
// };
//
// createClientPostRequest();

// 服务端程序，只是负责回传客户端数据
// var server = http.createServer(function(req, res){
//     res.write('Server got client data: ');
//     req.pipe(res);
// });

// server.listen(3000, createClientPostRequest);


// var http = require('http');
// var url = 'http://www.qq.com:3000?a=1&b=2';
//
// var client = http.get(url, function (res) {
//
//     console.log("1. response event");
//
//     var body = '';
//
//     res.on('data', function (d) {
//         body += d;
//     });
//
//     res.on('end', function () {
//         // var parsed = JSON.parse(body);
//         console.log("2. response event");
//         console.log(body);
//     });
// });
//
// client.on('response', function (res) {
//     console.log('3. response event');
// });
//
// client.end();

// var https = require('https');
//
// https.get('https://www.baidu.com', function(res){
//     console.log('status code: ' + res.statusCode);
//     console.log('headers: ' + JSON.stringify(res.headers));
//
//     res.on('data', function(data){
//         process.stdout.write(data);
//     });
// }).on('error', function(err){
//     console.error(err);
// });

// 如何证明这个是HTTPS的返回。









