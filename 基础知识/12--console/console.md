# console

### 0、概念

console模块提供了一个简单的调试控制台，它与Web浏览器提供的JavaScript的控制台的机制类似。

该模块导出两个特定组件：
    
    * 一个`Console`类，包含`console.log()`、`console.error()`和`console.warn()`等方法，可以用于写入到任何Node.js流。

    * 一个全局的`console`实例，用于写入process.stdout和process.stderr。全局的`console`使用时无需调用`require('console')`。

    注意：全局的console对象的方法既不是同步的（如浏览器中类似的API），也不总是异步的（如其他Node.js流）。

    示例1：console.js，使用全局的console：
    ```js
    console.log('hello world'); // 打印：hello world 到 stdout
    console.log('hello %s', 'world'); // 打印：hello world 到 stdout
    console.error(new Error('错误信息')); // 打印：[Error: 错误信息]到stderr

    const name = 'Will Robinson';
    console.warn(`Danger ${name}! Danger!`); // 打印：Danger Will Robinson! Danger! 到 stderr
    ```

    示例2：new_console.js，使用Console类：

    ```js
    const out = getStreamSomehow();
    const err = getStreamSomehow();
    const myConsole = new console.Console(out, err);
    myConsole.log('hello world'); // 打印：hello world 到out
    myConsole.log('hello %s', 'world'); // 打印：hello world 到out
    myConsole.error(new Error('错误信息')); // 打印：[Error: 错误信息]到err

    const name = 'Will Robinson';
    myConsole.warn(`Danger ${name}! Danger!`); // 打印：Danger Will Robinson! Danger! 到err
    ```

### 1、Console类

`Console`类可用于创建一个具有可配置的输出流的简单记录器，可以通过`require('console').Console`或`console.Console`使用：

```js
    const Console = require('console').Console;
    const Console = console.Console;
```

### 2、new Console(stdout[, stderr])

通过传入一个或两个可写流实例，创建一个新的`Console`对象。`stdout`是一个可写流，用于打印日志或输出信息。`stderr`用于输出警告或错误。如果没有传入`stderr`，则警告或错误输出会被发送到`stdout`。

```js
    const output = fs.createWriteStream('./stdout.log');
    const errorOutput = fs.createWriteStream('./stderr.log');
    const logger = new Console(output, errorOutput); // 自定义的简单记录器
    const count = 5; // 像 console 一样使用
    logger.log('count: %d', count); // stdout.log 中打印：count 5
```

### 3、console.assert(value[, message][, ...args])

一个简单的断言测试，验证`value`是否为真。如果不为真，则抛出`AssertionError`。如果提供了`message`，则使用`util.format()`格式化并作为错误信息使用。

```js
    console.assert(true, 'does nothing'); // 通过
    console.assert(false, 'Whoops %s', 'didn\'t work');
```

注意：Node.js中的`console.assert()`方法与在浏览器中的`console.assert()`方法的实现是不一样的。

具体地说，在浏览器中，用非真的断言调用`console.assert()`会导致`message`被打印到控制台但不会中断后续代码的执行。而在Node.js中，非真的断言会导致抛出`AssertionError`。

可以通过扩展Node.js的`console`并重写`console.assert()`方法来实现与浏览器中类似的功能。

例子myConsole.js，创建一个简单的模块，并扩展与重写了Node.js中console的默认行为。

```js
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
```

### 4、console.dir(obj[, options])

在obj上使用util.inspect()并打印结果字符串到`stdout`。该函数会绕过任何定义在`obj`上的自定义的`inspect()`函数。可选的`options`对象可以传入用于改变被格式化的字符串：

  * `showHidden` - 如果为`true`，则该对象中的不可枚举属性和symbol属性也会显示。默认为`false`。

  * `depth` - 告诉util.inspect()函数当格式化对象时要递归多少次。这对于检查较大的复杂对象很有用。默认为2。设为null可无限递归。

  * `colors` - 如果为`true`，则输出会带有ANSI颜色代码。默认为false。颜色是可定制的。

### 5、console.error([data][, ...args])

打印到`stderr`，并带上换行符。可以传入多个参数，第一个参数作为主要信息，其他参数作为类似于printf(3)中的代替值。

示例：console_error.js

```js
    const code = 5;
    console.error('error #%d', code); // 打印：error #5 到stderr
    console.error('error', code); // 打印：error 5 到stderr
```

如果在第一个字符串中没有找到格式化元素（如%d)，则在每个参数上调用util.inspect()并将结果字符串值拼在一起。

### 6、console.info([data][, ...args])

`console.info()`函数是console.log()的一个别名。

### 7、console.log([data][, ...args])

打印到`stdout`，并带上换行符。可以传入多个参数，第一个参数作为主要信息，其他参数作为类似于printf(3)中的代替值。

```js
    const count = 5;
    console.log('count: %d', count); // 打印：count: 5 到stdout
    console.log('count:', count); // 打印：count: 5 到stdout
```

如果在第一个字符串中没有找到格式化元素（如%d），则在每个参数上调用util.inspect()并将结果字符串值拼在一起。

### 8、console.time(label)

启动一个定时器，用以计算一个操作的持续时间。定时器由一个唯一的`label`标识。当调用console.timeEnd()时，可以使用相同的`label`来停止定时器，并以毫秒为单位将持续时间输出到`stdout`。

### 9、console.timeEnd(label)

停止之前通过调用console.time()启动的定时器，并打印结果到`stdout`：

```js
console.time('100-elements');
for (let i = 0; i < 100; i++) {
    ;
}
console.timeEnd('100-elements'); // 打印 100-elements：0.100ms
```

注意：从Node.js v6.0.0开始，`console.timeEnd()`删除了计时器以避免泄露。在旧版本上，计时器依然保留。它允许`console.timeEnd()`可以多次调用同一标签。此功能是非计划中的，不再被支持。

### 10、console.trace(message[, ...args])

打印字符串`Trace:`到stderr，并通过util.format()格式化消息与堆栈跟踪在代码中的当前位置。

```js
console.trace('Show me'); // 打印:（堆栈跟踪会根据被调用的跟踪的位置而变化）
//  Trace: Show me
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```

### 11、console.warn([data][, ...args])

`console.warn()`函数时console.error()的一个别名。




