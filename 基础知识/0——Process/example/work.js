








	var http = require('http');

	var server = http.createServer(function (req, res) {

	    res.end("kill -s SIGTERM " + process.pid);

	});

	server.listen(8000);


	console.log("子进程......");








