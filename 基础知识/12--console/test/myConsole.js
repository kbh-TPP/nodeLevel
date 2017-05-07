'use strict';
// 用一个新的不带补丁的assert实现来创建一个简单的console扩展。
// Object.create()：使用指定的原型对象和其属性创建了一个新的对象。
// ...args在函数被调用时，该形参会成为一个数组。数组中的元素都是传递给该函数的多出来的实参的值。
const myConsole = Object.create(console, {
    assert: {
        value: function assert(assertion, message, ...args) {
            try {
                console.assert(assertion, message, ...args);
            } catch (err) {
                console.error(err.stack);
            }
        },
        configurable: true,
        enumerable: true,
        writable: true
    }
});
module.exports = myConsole;