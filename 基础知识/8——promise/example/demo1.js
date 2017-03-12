    


    // 写法一
    // function Test() {
    //     var promise = new Promise(function(resolve, reject) {
    //         try {
    //             console.log('promise action');
    //             throw new Error('test');
    //             resolve("OK");

    //         } catch (e) {
    //             reject(e);
    //         }
    //     });

    //     return promise;
    // }

    // Test().catch(function(error) {
    //     console.log(error);
    // });

    // Test().then(undefined, function(error) {
    //     console.log(error);
    // });

    // 写法二
    // var promise = new Promise(function(resolve, reject) {
    //     reject(new Error('test'));
    // });
    // promise.catch(function(error) {
    //     console.log(error);
    // });


// var promise = new Promise(function (resolve){
//     console.log("inner promise");   // 1
//     resolve(42);
// });

// promise.then(function(value){
//     console.log(value);             // 3
// });

// console.log("outer promise");       // 2


// Promise.resolve(42).then(function(data) {
//     console.log(data);
// })

// setTimeout(function() {
//     console.log('setTimeout');
// }, 0);

// process.nextTick(function() {
//     console.log('nextTick');
// });

// console.log('console');

// function Test() {
//     var promise = new Promise(function(resolve, reject) {
//         // throw new Error('test');    // 等价于

//     });

//     return promise;
// }

// Test().catch(function(error) {

//     console.log("error");

// });




// function taskA() {
//     console.log("Task A");
//     throw new Error("throw Error @ Task A")
// }
// function taskB() {
//     console.log("Task B");// 不会被调用
// }
// function onRejected(error) {
//     console.log(error);// => "throw Error @ Task A"
// }
// function finalTask() {
//     console.log("Final Task");
// }

// var promise = Promise.resolve();
// promise
//     .then(taskA)
//     .then(taskB)
//     .catch(onRejected)
//     .then(finalTask);




// function timerPromisefy(delay) {
//     return new Promise(function (resolve) {
//         setTimeout(function () {
//             resolve(delay);
//         }, delay);
//     });
// }
// // 任何一个promise变为resolve或reject 的话程序就停止运行
// Promise.race([
//     timerPromisefy(1),
//     timerPromisefy(32),
//     timerPromisefy(64),
//     timerPromisefy(128)
// ]).then(function (value) {
//     console.log(value);    // => 1
// });





// var winnerPromise = new Promise(function (resolve) {
//         setTimeout(function () {
//             console.log('this is winner');
//             resolve('this is winner');
//         }, 4);
//     });
// var loserPromise = new Promise(function (resolve) {
//         setTimeout(function () {
//             console.log('this is loser');
//             resolve('this is loser');
//         }, 1000);
//     });
// // 第一个promise变为resolve后程序停止
// Promise.race([winnerPromise, loserPromise]).then(function (value) {
//     console.log(value);    // => 'this is winner'
// });


function throwError(value) {
    // 抛出异常
    throw new Error(value);
}
// <1> onRejected不会被调用
function badMain(onRejected) {
    return Promise.resolve(42).then(throwError, onRejected);
}
// <2> 有异常发生时onRejected会被调用
function goodMain(onRejected) {
    return Promise.resolve(42).then(throwError).catch(onRejected);
}
// 运行示例
badMain(function(){
    console.log("BAD");
});
goodMain(function(){
    console.log("GOOD");
});
