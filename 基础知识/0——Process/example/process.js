// console.log(process.argv);
//
// console.log("process.env.HGWJ = ", process.env.HGWJ);
//
// console.log("process.platform = ",  process.platform);
//
//
// console.funk = function(d) {
//     process.stdout.write(d + '\n');
// };

// var fs = require('fs');
//
// fs.createReadStream('wow.txt')
//     .pipe(process.stdout);

// var fs = require('fs');
// var zlib = require('zlib');
//
// fs.createReadStream('wow.txt')
//     .pipe(zlib.createGzip())
//     .pipe(process.stdout);

// var input = {};
// input.enter = function () {
//     // process.stdout.pipe(process.stdin);
//
//     process.stdin.pipe(process.stdout);
// }
// input.enter();

// process.stdin.setEncoding('utf8');
//
// process.stdin.on('readable', function() {
//     var chunk = process.stdin.read();
//     if (chunk !== null) {
//         process.stdout.write('data: ' + chunk);
//     }
// });
//
// process.stdin.on('end', function() {
//     process.stdout.write('end');
// });


// console.log("argv: ",process.argv);

// var myArgs = process.argv.slice(2);     // 截断，从第二个到最后一个。
// console.log(myArgs);


// function sleepTime() {
//     for (var i = 0; i < 1000; i++) {
//         for (var j = 0; j < 1000; j++) {
//             ;
//         }
//     }
//     console.log('sleepTime ------ ');
// }
//
// setTimeout(function () {
//     console.log("---- [ setTimeout 0] ----");
//     process.nextTick(function () {
//         console.log(' ---[ nextTick 0]--- ')
//     });
//
//     sleepTime();
//
// }, 999);
//
// setTimeout(function () {
//     process.nextTick(function () {
//         console.log(' ---[ nextTick A]--- ')
//     });
//
//     setTimeout(function () {
//         console.log("---- [ setTimeout A] ----");
//     }, 0);
//
//     setTimeout(function () {
//         console.log("---- [ setTimeout B] ----");
//     }, 0);
//
//     process.nextTick(function () {
//         console.log(' ---[ nextTick B]--- ')
//     });
//
// }, 1000);
//
//
// setTimeout(function () {
//     console.log("---- [ setTimeout 1] ----");
//
//     process.nextTick(function () {
//         console.log(' ---[ nextTick 1]--- ')
//     });
//
// }, 999);


// process.on('uncaughtException', function (err) {
//     console.error('got an error: %s', err.message);
//     process.exit(1);
// });
//
// setTimeout(function () {
//     throw new Error('fuck');
// }, 100);

// var http = require('http');
//
// var server = http.createServer(function (req, res) {
//     // ...
//     res.end("kill -s SIGTERM " + process.pid);
// });
// server.listen(8000);
//
// process.on('SIGTERM', function () {
//     console.log("收到 SIGTERM 信号");
//     server.close(function () {
//         console.log("关闭服务");
//         process.exit(0);
//     });
// });

// var fs = require('fs');
// process.on('SIGTERM', function(){
//     console.log('terminating');
//     process.exit(1);
// });
//
// setTimeout(function(){
//     console.log('sending SIGTERM to process %d', process.pid);
//     process.kill(process.pid, 'SIGTERM');
// }, 500);
//
// setTimeout(function(){
//     console.log('never called');
// }, 1000);
//
// process.on('exit', function () {
//     fs.writeFileSync('exit.txt', '需要保存到硬盘的信息');
// });


// 'use strict';
// process.on("exit", code =>
//     console.log("exiting with code: " + code))
//

// process.exit(0);


// process.on('uncaughtException', function(err) {
//     console.log('Caught exception: ' + err);
// });
//
// setTimeout(function() {
//     console.log('本行依然执行1');
//     setTimeout(function() {
//         console.log('本行依然执行2');
//         setTimeout(function() {
//             console.log('本行依然执行3');
//         }, 500);
//     }, 500);
// }, 500);
//
// // 下面的表达式抛出错误
// nonexistentFunc();


// process.stdin.resume();
//
// process.on('SIGINT', function() {
//     console.log('SIGINT信号，按Control-D退出');
// });




// process.execArgv.forEach(function(val, index, array) {
//     console.log("execArgv " + index + ': ' + val);
// });
// // 输出：
// // 0: --harmony
//
// process.argv.forEach(function(val, index, array) {
//     console.log("argv " + index + ': ' + val);
// });
//
// while(1);

// if(process.env.NODE_ENV === 'production'){
//     console.log('生产环境');
// }else{
//     console.log('非生产环境');
// }