
## commander
    
    指挥官的意思，是TJ写的一个工具.

```js

    var program = require('commander')

    program
        .version('0.0.1')
        .description('a test cli program')
        .option('-n, --name <name>', 'your name', 'GK')
        .option('-a, --age <age>', 'your age', '22')
        .option('-e, --enjoy [enjoy]')
        
    var a = program.parse(process.argv)

    console.log("name = ", a['name']);

```

    输出  
        node app.js -n hgwj
        name =  hgwj

    commander.js中命令行有两种可变性，一个叫做 option ，意为选项。一个叫做 command ，意为命令。
    