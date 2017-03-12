
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res){

    var body = '';
    req.on('data', function(thunk){
        body += thunk;
    });

    req.on('end', function(){

        a++;
        console.log( 'post body is: ' + body );

        res.end('ok');
    });
});

server.listen(3000);


process.on('uncaughtException', function(err){
    console.error('got an error: %s', err);

});
















