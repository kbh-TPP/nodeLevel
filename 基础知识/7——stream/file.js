

var fs = require('fs');
var readStream = fs.createReadStream('./src/TAF.pdf');
var writeStream = fs.createWriteStream('dest');

readStream.on('data', function(chunk) {         // 当有数据流出时，写入数据

    if (writeStream.write(chunk) === false) {   // 如果没有写完，暂停读取流
        readStream.pause();
    }

});

writeStream.on('drain', function() {    // 写完后，继续读取
    readStream.resume();
});

readStream.on('end', function() {       // 当没有数据时，关闭数据流
    writeStream.end();
});