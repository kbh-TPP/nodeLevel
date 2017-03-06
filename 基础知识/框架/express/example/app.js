// var express = require('express');
// var app = express();

// app.use(express.static(__dirname + '/public'));

// console.log(__dirname);
// app.listen(8080);







// var express = require('express');
// var app = express();

// app.get('/', function (req, res) {
//   res.send('Hello world!');
// });
// app.get('/customer', function(req, res){
//   res.send('customer page');
// });
// app.get('/admin', function(req, res){
//   res.send('admin page');
// });

// app.listen(3000);



// var express = require('express');
// var app = express();
// var routes = require('./router')(app);
// app.listen(3000);

// var express = require("express");
// var http = require("http");

// var app = express();

// app.use(function(request, response, next) {
//   console.log("In comes a " + request.method + " to " + request.url);
//   response.writeHead(200, { "Content-Type": "text/plain" });
//   response.write("Hello hg \n");

//   next();
// });

// app.use(function(request, response) {

//   response.write("Hello wj \n");
//   response.end("Hello world!\n");
// });

// http.createServer(app).listen(1337);



// var express = require("express");
// var http = require("http");

// var app = express();

// app.use(function(request, response, next) {
    
//     if (request.url == "/") {
//         response.writeHead(200, { "Content-Type": "text/plain" });
//         response.end("Welcome to the homepage!\n");
//     } else {
//         next();
//     }
// });

// app.use(function(request, response, next) {
    
//     if (request.url == "/about") {
//         response.writeHead(200, { "Content-Type": "text/plain" });
//         response.end('about \n');
//     } else {
//         next();
//     }
// });

// app.use(function(request, response) {
    
//     response.writeHead(404, { "Content-Type": "text/plain" });
//     response.end("404 error!\n");
// });

// http.createServer(app).listen(1337);

process.on('uncaughtException', function (err) {
	console.log('An uncaught error occurred!');
	console.log(err.stack);

});


// var express = require("express");
// var http = require("http");
// var url = require('url');
// var querystring = require('querystring');
// var app = express();

// // get 请求
// app.use("/get", function(request, response, next) {

//     console.log('get');

// 	var urlObj = url.parse(request.url);
//     var query = urlObj.query;
//     var queryObj = querystring.parse(query);

//     console.log(queryObj);

// 	response.writeHead(200, { "Content-Type": "text/plain" });
// 	response.write(" get request. \n");
// 	response.end('fuck \n');
// });

// // post 请求
// app.use("/post", function(request, response, next) {

//     console.log('post');

// 	var body = '';  
// 	request.on('data', function(thunk){
// 		body += thunk;
// 	});

// 	request.on('end', function(){
// 		console.log( 'post body is: ' + body );
		
// 		response.write(" post request. \n");
// 		response.end('over \n');
// 	}); 
// });

// // 404
// app.use(function(request, response) {

// 	console.log('404');

// 	response.writeHead(404, { "Content-Type": "text/plain" });
// 	response.end("404 error!\n");
// });

// http.createServer(app).listen(1337);


var express = require("express");
var app = express();


app.get("/download", function(request, response) {
	response.sendFile( __dirname + "/compressed.tracemonkey-pldi-09.pdf");
});

var uploading = multer({
	dest: __dirname + '../public/uploads/',
	// 设定限制，每次最多上传1个文件，文件大小不超过1MB
	limits: {fileSize: 1000000, files:1},
})

app.post('/upload', uploading, function(req, res) {
	
})


http.createServer(app).listen(1337);
























