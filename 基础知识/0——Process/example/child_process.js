
"use strict";

// var cp = require('child_process');
// cp.spawn('node', ['work.js']);

// console.log("主进程......");

// cp.exec('node work.js', function(err, stdout, stderr) {
//     // some code
// });
// cp.execFile('work.js', function(err, stdout, stderr) {
//     // some code
// });
// cp.fork('./work.js');


// "use strict";
// const spawn = require('child_process').spawn;
// const ls = spawn('ls', ['-al', '/usr/local/Library/']);	// 启动一个子进程
//
//
// console.log(ls.stdout == process.stdout);

// ls.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// });


// ls.stderr.on('data', (data) => {
//     console.log(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
// });

// const spawn = require('child_process').spawn;
// const ls = spawn('ls', ['-lh', '/usr']);
//
// ls.stdout.on('data', (data) => {
//     console.log(`数据输出 ${data}`);
// });
//
// ls.stderr.on('data', (data) => {
//     console.log(`错误输出 ——  ${data}`);
// });
//
// ls.on('close', (code) => {
//
//     console.log(`我已经结束了 哈哈 —— ${code}`);
// });

// var exec = require('child_process').exec;
//
// // 成功的例子
// exec('ls -al', function(error, stdout, stderr){
//     if(error) {
//         console.error('error: ' + error);
//         return;
//     }
//
//     console.log('stdout: ' + stdout, ' typeof stdout :',typeof stdout);
//     console.log('stderr: ' + stderr, ' typeof stderr :',typeof stderr);
//     console.log();
//     console.log();
// });
//
//
// // 失败的例子
// exec('ls hello.txt', function(error, stdout, stderr){
//     if(error) {
//         console.error('error: ' + error, "typeof error: ", typeof error);
//         return;
//     }
//     console.log('stdout: ' + stdout);
//     console.log('stderr: ' + stderr);
// });



// var execFile = require('child_process').execFile;
//
// console.log(execFile.toString());



// var child_process = require('child_process');
//
// child_process.execFile('node', ['--version'], function(error, stdout, stderr){
//     if(error){
//         throw error;
//     }
//     console.log(stdout);
// });
//
// child_process.execFile('node ', ['--version'], function(error, stdout, stderr){
//     if(error){
//         throw error;
//     }
//     console.log(stdout);
// });
//

// var child_process = require('child_process');
// var execFile = child_process.execFile;
// var exec = child_process.exec;
//
// exec('ls -al .', function(error, stdout, stderr){
//     if(error){
//         throw error;
//     }
//     console.log(stdout);
// });
//
// execFile('ls -al .', {shell: '/bin/bash'}, function(error, stdout, stderr){
//     if(error){
//         throw error;
//     }
//     console.log(stdout);
// });


// var child_process = require('child_process');
// var execFile = child_process.execFile;
// var exec = child_process.exec;
// exec
// var cmd = 'ls -l .;pwd';
// var ls = child_process.exec(cmd, function (error, stdout, stderr) {
//     if (error) {
//         console.log(error.stack);
//         console.log('Error code: '+error.code);
//     }
//     console.log('Child Process STDOUT: '+stdout);
// });

// execFile
// var path = ".;pwd";
// var path = "./";
// child_process.execFile('/bin/ls', ['-l', path], function (err, result) {
//     console.log(result)
// });




var child_process = require('child_process');
var n1 = child_process.fork('./child1.js');
var n2 = child_process.fork('./child2.js');

n1.on('message', function(m) {

    console.log('PARENT got message:', m);

});

n2.on('message', function(m) {

    console.log('PARENT got message:', m);

});

n1.send({ hello: 'world' });
n2.send({ hello: 'world' });
















