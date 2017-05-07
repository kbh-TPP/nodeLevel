// console.log('hello world'); // 打印：hello world 到 stdout
// console.log('hello %s', 'world'); // 打印：hello world 到 stdout
// console.error(new Error('错误信息')); // 打印：[Error: 错误信息]到stderr

// const name = 'Will Robinson';
// console.warn(`Danger ${name}! Danger!`); // 打印：Danger Will Robinson! Danger! 到 stderr

const console = require('./myConsole');
console.assert(false, '会打印这个消息，但不会抛出错误');
console.log('这个也会打印');

