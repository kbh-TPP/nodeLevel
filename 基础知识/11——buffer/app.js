


// // 生成一个256字节的Buffer实例
// var bytes = new Buffer(256);

// // 遍历每个字节,写入内容,初始化
// for (var i = 0; i < bytes.length; i++) {
// 	bytes[i] = i;
// }

// // 生成一个buffer的view
// // 从240字节到256字节
// var end = bytes.slice(240, 256);

// end[0] // 240
// end[0] = 0;
// end[0] // 0

// console.log("end = ", end);




// var bytes = new Buffer(8);

// for (var i = 0; i < bytes.length; i++) {
//   bytes[i] = i;
// }

// var more = new Buffer(4);
// bytes.copy(more, 0, 4, 8);      // 将 bytes 拷贝到 more 中
// more[0]     // 4

// console.log(more);



// buf = new Buffer(1234);
// console.log("buf.length = ", buf.length); // 1234
// console.log("buf.byteLength = ", buf.byteLength)	// 0

// for (var pro in buf) {
// 	console.log(pro, " = " ,buf[pro]);
// }

// buf.write("some string", 0, "ascii");

// console.log("buf.length = ", buf.length)	// 1234
// console.log("buf.byteLength = ", buf.byteLength)	// 4

Buffer.byteLength(value, 'utf8');


// var buf = new Buffer([10, 20, 30, 40, 50]);
// console.log("buf = ", buf);


var buf = new Buffer(40);
buf.writeUInt8(7777);

console.log("buf = ", buf);












