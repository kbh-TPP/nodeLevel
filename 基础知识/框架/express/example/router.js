
// var getfn = function(f) {

// 	var f = 1;

// 	function f() {
// 		return 1;
// 	}
// 	return f();

// 	function f() {
// 		return 3;
// 	}
// };

// getfn(3)







module.exports = function(app) {
	
	app.get('/', function(req, res,next) {
		console.log('get');
		res.send({a:'Hello world'});
		res.send({b:'Hello world'});
		next();
	});
	
	app.get('/customer', function(req, res) {
		res.send('customer page');
	});

	app.get('/admin', function(req, res) {
		res.send('admin page');
	});

	app.all('*', function(req, res) {

		console.log('1231312');
		res.end({b:'Hello world'});
	})
};















