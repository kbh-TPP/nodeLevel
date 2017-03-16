// var cluster = require('cluster');
// var os = require('os');

// var start = require("./app.js");

// if (cluster.isMaster){
//   for (var i = 0, n = os.cpus().length; i < n; i += 1){
//     cluster.fork();
//   }
// } else {
//     start.start();
// }

var cluster = require('cluster');
var start = require("./app.js");

if (cluster.isMaster) {
    var numWorkers = require('os').cpus().length;
    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log("worker id = ", worker.id);
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });

    setTimeout(function() {
        var allWorkers = function() {
            return Object.getOwnPropertyNames(cluster.workers).map(function(id) {
                return cluster.workers[id];
            });
        };

        var allWorkerlist = allWorkers();
        console.log("allWorkerlist = ", allWorkerlist);
    }, 3000);

} else {
    start.start();
}





// if (cluster.isMaster) {
//     var worker = cluster.fork();
//     worker.send('主进程');

//     worker.on('message', function(message) {
//       console.log("message = ", message);
//     });



// } else if (cluster.isWorker) {
//     process.on('message', function(msg) {
//         console.log('msg = ', msg);
//         process.send("你好");
//     });
// }