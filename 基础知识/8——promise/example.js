// function timeout(ms) {
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve, ms, 'done');
//   });
// }

// timeout(100).then((value) => {
//   console.log(value);
// });



// setTimeout(function() {

// 	console.log(arguments);

// }, 100, 'done', 'error');






// var p1 = new Promise(function(resolve, reject) {
//     setTimeout(() => {
//         console.log(arguments);
//         reject(new Error('fail'))
//     }, 3000, "apple")
// })

// var p2 = new Promise(function(resolve, reject) {
//     setTimeout(() => {
//         console.log(arguments);
//         resolve(p1);
//     }, 1000, 'blnanar')
// })

// p2.then(result => console.log(result))
// 	.catch(error => console.log(error))






// var someAsyncThing = function() {
//     return new Promise(function(resolve, reject) {
//         // 下面一行会报错，因为x没有声明
//         reject("error");
//     });
// };

// someAsyncThing().then(function() {
//     console.log('everything is great');
// }).catch(function(error) {
// 	console.log(error);
// });





// var someAsyncThing = function() {
//     return new Promise(function(resolve, reject) {

//         throw new Error("fuck stop ... ");
//     });
// };

// someAsyncThing().then(function() {
//     console.log('everything is great');

// });

// const p = Promise.race([
//   fetch('/resource-that-may-take-a-while'),
//   new Promise(function (resolve, reject) {
//     setTimeout(() => reject(new Error('request timeout')), 5000)
//   })
// ]);

// p.then(response => console.log(response));
// p.catch(error => console.log(error));




// let thenable = {
//   then: function(resolve, reject) {
//     console.log('then able object action');
//     resolve(42);
//   }
// };

// let p1 = Promise.resolve(thenable); 
// p1.then(function(value) {
//   console.log(value);   // 42
// });

    setTimeout(function () {
      console.log('four');
    }, 0);

    Promise.resolve().then(function () {
      console.log('three');
    });

    process.nextTick(function() {
        console.log('two');
    }, 0)
    
    console.log('one');






