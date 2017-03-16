var http = require('http');

exports.start = function () {
	console.log("start");
    http.createServer(function(req, res) {
        res.writeHead(200);
        res.end("hello world\n");

    }).listen(8000);
};


process.on('message', function(msg) {
    process.send(msg);
});