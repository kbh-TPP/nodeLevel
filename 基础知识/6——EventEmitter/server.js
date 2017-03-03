var http = require("http");



var server = http.createServer(function(serverReq, serverRes){
    var url = serverReq.url;
    serverRes.end( '您访问的地址是：' + url );
});

// util.inherits(server, EventEmitter);


server.once('connection', function (stream) {
    console.log('Ah, we have our first user!');
});

server.listen(3000);


