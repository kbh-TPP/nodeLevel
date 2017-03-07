
function testhg() {
	var promise = new Promise(function(resolve, reject) {
		resolve(1);
	});

	return promise;
}

const initConfig = fun => {
	return testhg().then(data => {
		console.log("data1 = ", data);

		setTimeout(function (data) {
			fun();
		}, 1000);
		
	}, err => {
		console.log('error');
	
	});
};

const startServant = () => {
	console.log('hgwj');
	return Promise.resolve({test: "hgwj"});
}

initConfig(() => {
	startServant();
});






















