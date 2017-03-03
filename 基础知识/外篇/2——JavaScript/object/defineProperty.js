
"use strict";

// Create a user-defined object.
var obj = {};

// Add a data property to the object.

/**
 * 1)   需要 被定义或者修改的对象
 * 2)   需要 定义 或者 修改属性的名字
 * 3)   需要定义或修改的属性描述符
 */
var value = "";
Object.defineProperty(obj, "value", {

    set: function (val) {
        console.log( 'set' );
        value = val;
    },
    get: function () {
        console.log( 'get' );

        return value;
    }
    // value: 101,          // 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
    // writable: true,         // 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
    // enumerable: true        // 当且仅当该属性的 writable 为 true 时，该属性才能被赋值运算符改变。默认为 false。
    // configurable: true  // 当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，也能够被删除。默认为 false。
});

// Set the property value.
obj.value = 102;         // 这里触发set 方法
console.log("Property value: " + obj.value );   // 这里触发 get 方法




// var names = Object.getOwnPropertyNames(obj);
// for (var i = 0; i < names.length; i++) {
//     var prop = names[i];
//
//     console.log(prop + ': ' + obj[prop]);
// }


// Object.defineProperty(obj, "value", { writable: false, value: 'fuck you', configurable: false});

console.log(obj);

// obj.value = "111";

console.log(obj);