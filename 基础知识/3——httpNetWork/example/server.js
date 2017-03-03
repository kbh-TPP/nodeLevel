// var net = require('net');
//
// var PORT = 8989;
// var HOST = '127.0.0.1';
//
// var server = net.createServer(function(socket){
//     console.log('Connected: ' + socket.remoteAddress + ':' + socket.remotePort);
//
//     socket.on('data', function(data){
//         console.log('DATA ' + socket.remoteAddress + ': ' + data);
//         console.log('Data is: ' + data);
//
//         socket.write('Data from you is  "' + data + '"');
//     });
//
//     socket.on('close', function(){
//         console.log('CLOSED: ' +
//             socket.remoteAddress + ' ' + socket.remotePort);
//     });
// });
// server.listen(PORT, HOST);
//
// console.log(server instanceof net.Server);  // true

// 下面的 req
// var http = require('http');
// var server = http.createServer(function (req, res) {
//     console.log(req.headers);
//     // res.send('ok');
//     res.end("ok");
// });
// server.listen(3000);


// var http = require('http');
// http.get('http://127.0.0.1:3000', function (res) {
//
//     console.log();
//     console.log(res.statusCode);
// });


// var http = require('http');
//
// var server = http.createServer(function(req, res){
//     console.log( '1、客户端请求url：' + req.url );
//     console.log( '2、http版本：' + req.httpVersion );
//     console.log( '3、http请求方法：' + req.method );
//     console.log( '4、http请求头部' + JSON.stringify(req.headers) );
//
//     res.end('ok');
// });
//
// server.listen(3000);

// var http = require('http');
// var url = require('url');       // 一个 url 解析参数的内置组建
// var querystring = require('querystring');
//
// var server = http.createServer(function(req, res){
//     var urlObj = url.parse(req.url);
//     var query = urlObj.query;
//     var queryObj = querystring.parse(query);
//
//
//     console.log("urlObj = ", urlObj);
//
//
//     // console.log( JSON.stringify(queryObj) );
//
//     res.end('ok');
// });
//
// server.listen(80);

//
// var http = require('http');
// var url = require('url');
// var querystring = require('querystring');
//
// var server = http.createServer(function(req, res){
//
//     var body = '';
//     req.on('data', function(thunk){
//         body += thunk;
//     });
//
//     req.on('end', function(){
//         console.log( 'post body is: ' + body );
//         res.end('ok');
//     });
// });
//
// server.listen(3000);


// var http = require('http');
// var server = http.createServer(function(req, res){
//     res.end('ok');
//
// });
// server.listen(3000);
//


// var http = require('http');
//
// // 设置状态码、状态描述信息、响应主体
// var server = http.createServer(function(req, res){
//     res.writeHead(200, 'ok', {
//         'Content-Type': 'text/plain'
//     });
//     res.end('hello\n');
// });
//
// server.listen(3000);

// 'use stict;'

// var http = require('http');
//
// var server = http.createServer( (req, res) => {
//
//     res.setHeader('Content-Type', 'text/html');
//     res.writeHead(200, 'ok', {
//         'Content-Type': 'text/plain'    //  覆盖前面的字段
//     });
//
//     res.setTimeout(3000, function () {
//         console.log('set time out');
//         res.end('set time out \n');
//     });
//
//     // res.end('hello');
// });
//
// server.listen(3000);


// var http = require('http');
//
// var server = http.createServer( (req, res) => {
//
//     res.setHeader('Content-Type', 'text/html');
//     console.log(res.headersSent);       // false
//
//     res.writeHead(200, 'ok', {
//         'Content-Type': 'text/plain'    //  覆盖前面的字段
//     });
//
//     console.log(res.headersSent);       // true
//
//     res.setTimeout(3000, function () {
//
//
//         console.log('set time out');
//         res.end('set time out \n');
//     });
//
//     // res.end('hello');
// });
//
// server.listen(3000);


// var server1 = require('_http_server');
// var server2 = require('http');
//
// for (var pro in server1) {
//     console.log(pro);
// }
//
// console.log("------------------\n")
//
// for (var pro in server2) {
//     console.log(pro);
// }

//
// var http = require("http");
// var url = require('url');
// var querystring = require('querystring');
//
// http.createServer(function (req, res) {
//
//
//     console.log("header: ",req.headers);
//
//     var body = '';
//     req.on('data', function (thunk) {
//         body += thunk;
//     });
//
//     req.on('end', function () {
//         console.log('body :' + body + "\n");
//
//         // res.send("data is test");
//         res.end('bye');
//     });
//
// }).listen(3000);


// var http = require("http");
// var url = require('url');
// var querystring = require('querystring');
//
// http.createServer(function (req, res) {
//
//     console.log(req.url);
//
//     // console.log(res.);
//
//     res.write('{ok:"1234"}');
//     res.end("ok");
//
// }).listen(3000);


// var http = require('http');
//
// var server = http.createServer(function(req, res){
//     console.log('客户端请求url：' + req.url);
//     console.log('http版本：' + req.httpVersion);
//     console.log('http请求方法：' + req.method);
//
//     res.end('ok');
// });
//
// server.listen(3000);


// var http = require('http');
// var url = require('url');
// var querystring = require('querystring');
//
// var server = http.createServer(function(req, res){
//
//     console.log(JSON.stringify(req.headers) + "\n");
//
//     var body = '';
//     req.on('data', function(thunk){
//         body += thunk;
//     });
//
//     req.on('end', function(){
//         console.log( 'post body is: ' + body );
//         res.end('ok');
//     });
// });
//
// server.listen(3000);


// var http = require('http');
// var server = http.createServer(function (req, res) {
//     res.writeHead(200, {'content-type': 'text/plain',});
//     res.end('from server');
// });
// server.listen(3000);
//
// var client = http.get('http://127.0.0.1:3000', function (res) {
//     console.log('1、http版本：' + res.httpVersion);
//     console.log('2、返回状态码：' + res.statusCode);
//     console.log('3、返回状态描述信息：' + res.statusMessage);
//     console.log('4、返回正文：');
//
//     res.pipe(process.stdout);
// });


// var http = require('http');
//
// var server = http.createServer(function (req, res) {
//
//     console.log('1、收到客户端请求: ' + req.url);
//
//     req.on('aborted', function () {
//         console.log('2、客户端请求aborted');
//
//     });
//
//     req.on('close', function () {
//         console.log('3、客户端请求close');
//
//     });
//
//     // res.end('ok'); 故意不返回，等着客户端中断请求
// });
//
// server.listen(3000);


// 输出如下
// 1、收到客户端请求: /aborted
// 2、客户端请求aborted
// 3、客户端请求close



// var http = require('http');
//
// var server = http.createServer(function(req, res){
//
//     console.log('1、收到客户端请求: ' + req.url);
//
//     req.on('aborted', function(){
//         console.log('2、客户端请求aborted');
//     });
//
//     req.on('close', function(){
//         console.log('3、客户端请求close');
//     });
//
//     // res.end('ok'); 故意不返回，等着客户端中断请求
// });
//
// server.listen(3000, function(){
//     var client = http.get('http://127.0.0.1:3000/aborted');
//     setTimeout(function(){
//         client.abort();  // 故意延迟100ms，确保请求发出
//     }, 100);
// });


// reqSocketClose.js
// var http = require('http');
//
// var server = http.createServer(function(req, res){
//
//     console.log('server: 收到客户端请求');
//
//     req.on('close', function(){
//         console.log('server: req close');
//     });
//
//     req.socket.on('close', function(){
//         console.log('server: req.socket close');
//     });
//
//     res.end('ok');
// });
//
// server.listen(3000);
//
// var client = http.get('http://127.0.0.1:3000/aborted', function(res){
//     console.log('client: 收到服务端响应');
// });



// var http = require('http');
// var PORT = 3000;
// var noop = function(){};
//
// var svr = http.createServer(noop);
// var anotherSvr = http.createServer(noop);
//
// anotherSvr.on('error', function(e){
//     console.error('出错啦！' + e.message);
// });
//
// svr.listen(PORT, function(){
//     anotherSvr.listen(PORT);
// });








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








