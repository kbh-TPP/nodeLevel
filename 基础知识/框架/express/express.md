## express


### 1 概述
	
	Express是目前最流行的基于Node.js的Web开发框架，可以快速地搭建一个完整功能的网站。

    npm init

    npm install --save express


```js

    var express = require('express');
    var app = express();

    // __dirname 是当前执行的文件路径
    app.use(express.static(__dirname + '/public'));
    app.listen(8080);

```

	运行 node app.js 
	运行以后，可以访问这个目录下面的资源文件。如果有 test.png；
	可以找浏览器中输入 localhost:8080/test.png 即可



```js

	var express = require('express');
	var app = express();
	app.get('/', function (req, res) {
	  res.send('Hello world!');
	});
	app.listen(3000);

```
	
	运行之后，可以访问 localhost:8080/***.***
	返回，hello world 的字符串。
	上面代码会在本机的3000端口启动一个网站，网页显示Hello World。

	启动脚本index.js的app.get方法，用于指定不同的访问路径所对应的回调函数，这叫做“路由”（routing）。上面代码只指定了根目录的回调函数，因此只有一个路由记录。实际应用中，可能有多个路由记录。


```js

	var express = require('express');
	var app = express();

	app.get('/', function (req, res) {
	  res.send('Hello world!');
	});
	app.get('/customer', function(req, res){
	  res.send('customer page');
	});
	app.get('/admin', function(req, res){
	  res.send('admin page');
	});

	app.listen(3000);

```
	
	这时，最好就把路由放到一个单独的文件中，比如新建一个routes子目录

```js

	// routes/index.js
	module.exports = function(app) {
		app.get('/', function(req, res) {
			res.send('Hello world');
		});
		app.get('/customer', function(req, res) {
			res.send('customer page');
		});
		app.get('/admin', function(req, res) {
			res.send('admin page');
		});
	};

	// app.js
	var express = require('express');
	var app = express();
	var routes = require('./routes')(app);
	app.listen(3000);

```

	把路由抽离出去，挺酷的吧。这样，就分离了。
	exports 导出的是一个【function】， 将app作为参数传入进去。


### 2 运行原理
	

#### 2.1 底层：http模块
	
	Express框架建立在node.js内置的http模块上。http模块生成服务器的原始代码如下。

```js
	
	var http = require("http");

	var app = http.createServer(function(request, response) {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.end("Hello world!");
	});

	app.listen(3000, "localhost");
	
```
	上面代码的关键是http模块的createServer方法，表示生成一个HTTP服务器实例。该方法接受一个回调函数，该回调函数的参数，分别为代表HTTP请求和HTTP回应的request对象和response对象。

	Express框架的核心是对http模块的再包装。上面的代码用Express改写如下。

```js

	var express = require('express');
	var app = express();

	app.get('/', function (req, res) {
		res.send('Hello world!');
	});

	app.listen(3000);

```
	比较两段代码，可以看到它们非常接近。原来是用http.createServer方法新建一个app实例，现在则是用Express的构造方法，生成一个Epress实例。两者的回调函数都是相同的。Express框架等于在http模块之上，加了一个中间层。


#### 2.2 中间件
	
	简单说，中间件（middleware）就是处理HTTP请求的函数。它最大的特点就是，一个中间件处理完，再传递给下一个中间件。App实例在运行过程中，会调用一系列的中间件。

	每个中间件可以从App实例，接收三个参数，依次为request对象（代表HTTP请求）、response对象（代表HTTP回应），next回调函数（代表下一个中间件）。每个中间件都可以对HTTP请求（request对象）进行加工，并且决定是否调用next方法，将request对象再传给下一个中间件。

	一个不进行任何操作、只传递request对象的中间件，就是下面这样。

```js

	function uselessMiddleware(req, res, next) {
		next();
	}

```	
	上面代码的next就是下一个中间件。如果它带有参数，则代表抛出一个错误，参数为错误文本。


```js

	function uselessMiddleware(req, res, next) {
		next('出错了！');
	}

```
	抛出错误以后，后面的中间件将不再执行，直到发现一个错误处理函数为止。


#### 2.3 use方法
	
	use是express注册中间件的方法，它返回一个函数。下面是一个连续调用两个中间件的例子。

```js

	var express = require("express");
	var http = require("http");

	var app = express();

	app.use(function(request, response, next) {
	  console.log("In comes a " + request.method + " to " + request.url);
	  response.writeHead(200, { "Content-Type": "text/plain" });
	  response.write("Hello hg \n");
	  
	  next();
	});

	app.use(function(request, response) {
	  
	  response.write("Hello wj \n");
	  response.end("Hello world!\n");
	});

	http.createServer(app).listen(1337);

```	

	上面代码使用app.use方法，注册了两个中间件。收到HTTP请求后，先调用第一个中间件，在控制台输出一行信息，然后通过next方法，将执行权传给第二个中间件，输出HTTP回应。由于第二个中间件没有调用next方法，所以request对象就不再向后传递了。

	use方法内部可以对访问路径进行判断，据此就能实现简单的路由，根据不同的请求网址，返回不同的网页内容。

```js

	var http = require("http");
	var app = express();

	app.use(function(request, response, next) {
	    
	    if (request.url == "/") {
	        response.writeHead(200, { "Content-Type": "text/plain" });
	        response.end("Welcome to the homepage!\n");
	    } else {
	        next();
	    }
	});

	app.use(function(request, response, next) {
	    
	    if (request.url == "/about") {
	        response.writeHead(200, { "Content-Type": "text/plain" });
	        response.end('about \n');
	    } else {
	        next();
	    }
	});

	app.use(function(request, response) {
	    
	    response.writeHead(404, { "Content-Type": "text/plain" });
	    response.end("404 error!\n");
	});

	http.createServer(app).listen(1337);

```
	
	上面代码通过request.url属性，判断请求的网址，从而返回不同的内容。注意，app.use方法一共登记了三个中间件，只要请求路径匹配，就不会将执行权交给下一个中间件。因此，最后一个中间件会返回404错误，即前面的中间件都没匹配请求路径，找不到所要请求的资源。

	除了在回调函数内部判断请求的网址，use方法也允许将请求网址写在第一个参数。这代表，只有请求路径匹配这个参数，后面的中间件才会生效。无疑，这样写更加清晰和方便。

```js

	app.use('/path', someMiddleware);
	
```

	因此，上面的例子，还可以这么写,通过use，代替 get 和 post。

```js

	var express = require("express");
	var http = require("http");
	var url = require('url');
	var querystring = require('querystring');
	var app = express();

	// get 请求
	app.use("/get", function(request, response, next) {

	    console.log('get');

		var urlObj = url.parse(request.url);
	    var query = urlObj.query;
	    var queryObj = querystring.parse(query);

	    console.log(queryObj);

		response.writeHead(200, { "Content-Type": "text/plain" });
		response.write(" get request. \n");
		response.end('fuck \n');
	});

	// post 请求
	app.use("/post", function(request, response, next) {

	    console.log('post');

		var body = '';  
		request.on('data', function(thunk){
			body += thunk;
		});

		request.on('end', function(){
			console.log( 'post body is: ' + body );
			
			response.write(" post request. \n");
			response.end('over \n');
		}); 
	});

	// 404
	app.use(function(request, response) {

		console.log('404');

		response.writeHead(404, { "Content-Type": "text/plain" });
		response.end("404 error!\n");
	});

	http.createServer(app).listen(1337);

```

	测试

	浏览器输出 http://www.qq.com:1337/get?hg=test&wj=123
	
	node server 输出
		get
		{ hg: 'test', wj: '123' }


	curl -d 'haige=hello&wj=world' http://127.0.0.1:1337/post
	node server 输出
		post
		post body is: haige=hello&wj=world

#### use 方法 内部，其实可以处理 post 和 get 请求。这样，所有的接口，就直接通过这个方式搞定即可。
	


### 3.Express的方法
	

#### 3.1 all方法和HTTP动词方法
	
	针对不同的请求，Express提供了use方法的一些别名。比如，上面代码也可以用别名的形式来写。

```js

	var express = require("express");
	var http = require("http");
	var app = express();

	app.all("*", function(request, response, next) {
		response.writeHead(200, { "Content-Type": "text/plain" });
		next();
	});

	app.get("/", function(request, response) {
		response.end("Welcome to the homepage!");
	});

	app.get("/about", function(request, response) {
		response.end("Welcome to the about page!");
	});

	app.use("*", function(request, response) {
		response.end("404!");
	});

	http.createServer(app).listen(1337);

```
	
	上面的代码要注意顺序，这里写的还是蛮好的。

		1 —— all("*", function() { ... })	所有的请求都过这个方法
		2 —— get("/")  这里的正则匹配是非常严格的，
			这里直接接受 curl  http://127.0.0.1:1337  和  curl  http://127.0.0.1:1337/
		3 —— get('about') 就是关于的请求
		4 —— use("*") 	之前请求没有处理的，都来到这里。

#### 3.2 set方法
	
	set方法用于指定变量的值。

```js
	
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");

	app.set('title', 'My Site');
	app.get('title'); // "My Site"

```

#### 3.3 response对象
	
##### 1）response.redirect方法	
	
	response.redirect方法允许网址的重定向。

```js

	var express = require("express");
	var http = require("http");
	var app = express();

	app.all("*", function(request, response, next) {
		next();
	});

	app.get("/", function(request, response) {
		response.redirect(301, "http://www.baidu.com");
	});

	http.createServer(app).listen(1337);

```

##### 2）response.sendFile方法用于发送文件。
	
```js

	var express = require("express");
	var app = express();

	app.get("/download", function(request, response) {
		response.sendFile( __dirname + "/compressed.tracemonkey-pldi-09.pdf");
	});

	http.createServer(app).listen(1337);

```

	注意：这里文件要至少可读，并且路径，一定要是绝对路径，否则会报错，
		 mac系统是这样的，别的不确定。


##### 3）response.render方法

	response.render方法用于渲染网页模板

```js

	app.get("/", function(request, response) {
		response.render("index", { message: "Hello World" });
	});

```
	上面代码使用render方法，将message变量传入index模板，渲染成HTML网页。


#### 3.4 requst对象
	
	（1）request.ip
		request.ip属性用于获得HTTP请求的IP地址。

	（2）request.files
		request.files用于获取上传的文件。


#### 3,5 搭建HTTPS服务器

```js

	var fs = require('fs');
	var options = {
		key: fs.readFileSync('./ssl/myserver.key'),
		cert: fs.readFileSync('./ssl/myserver.crt'),
		passphrase: '1234'
	};

	var https = require('https');
	var express = require('express');
	var app = express();

	app.get('/', function(req, res){
		res.send('Hello World Expressjs');
	});

	var server = https.createServer(options, app);
	server.listen(8084);
	console.log('Server is running on port 8084');


```
	// 加载一个【证书】和【钥】就可以了，


#### 注意
	
	返回的时候 也可以选择 res.json(200, {hg:'wj'});



### 3.6 上传文件
	
```html

	<form action="/pictures/upload" method="POST" enctype="multipart/form-data">
		Select an image to upload:
		<input type="file" name="image">
		<input type="submit" value="Upload Image">
	</form>

```
	然后，服务器脚本建立指向/upload目录的路由。这时可以安装multer模块，它提供了上传文件的许多功能。

```js

	var express = require('express');
	var router = express.Router();
	var multer = require('multer');

	var uploading = multer({
		dest: __dirname + '../public/uploads/',
		// 设定限制，每次最多上传1个文件，文件大小不超过1MB
		limits: {fileSize: 1000000, files:1},
	})

	router.post('/upload', uploading, function(req, res) {

	})

	module.exports = router

```






















