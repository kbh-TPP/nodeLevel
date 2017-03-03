

// var http = require('http');
// var fs = require('fs');
// //
// var server = http.createServer(function (req, res) {
//     fs.readFile(__dirname + '/src/data.txt', function (err, data) {
//
//         console.log(data)
//
//         res.end(data);
//
//     });
// });
// server.listen(8000);
//
// console.log(__dirname);


//
// var http = require('http');
// var fs = require('fs');
//
// var server = http.createServer(function (req, res) {
//     var stream = fs.createReadStream(__dirname + '/src/data.txt');
//
//     stream.pipe(oppressor(req)).pipe(res);
// });
// var oppressor = require('oppressor');
// server.listen(8000);


// var Readable = require('stream').Readable;
//
// var rs = new Readable;
// rs.push('beep ');
// rs.push('boop\n');
// rs.push(null);      // 要以这个结尾
//
// rs.pipe(process.stdout);

// 在上面的代码中rs.push(null)的作用是告诉rs输出数据应该结束了。

// var Readable = require('stream').Readable;
// var rs = Readable();
//
// var c = 97;
// rs._read = function () {
//     rs.push(String.fromCharCode(c++));
//
//     if (c > 'z'.charCodeAt(0)) {
//         rs.push(null);
//     }
// };
//
// rs.pipe(process.stdout);



// process.stdin.on('readable', function () {
//     var buf = process.stdin.read();
//     console.dir(buf);
// });


