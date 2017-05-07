// const out = getStreamSomehow();
// const err = getStreamSomehow();
// const myConsole = new console.Console(out, err);
// myConsole.log('hello world'); // 打印：hello world 到out
// myConsole.log('hello %s', 'world'); // 打印：hello world 到out
// myConsole.error(new Error('错误信息')); // 打印：[Error: 错误信息]到err

// const name = 'Will Robinson';
// myConsole.warn(`Danger ${name}! Danger!`); // 打印：Danger Will Robinson! Danger! 到err

const fs = require('fs');
const Console = require('console').Console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
const logger = new Console(output, errorOutput); // 自定义的简单记录器
const count = 5; // 像 console 一样使用
logger.log('count: %d', count); // stdout.log 中打印：count 5

console.assert(true, 'does nothing'); // 通过
console.assert(false, 'Whoops %s', 'didn\'t work');

