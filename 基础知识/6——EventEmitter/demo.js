
var Fuck = require("./Fuck");


var station = {
    freq: '80.16',
    name: 'Rock N Roll Radio',
};


var fuck = new Fuck(station);
console.log('new Fuck 的时候，会执行setTimeout方法，进行事件 start 和 end 事件的触发。 \n');


fuck.on('start', function(station) {
    console.log(" 触发后 start 的回调 \n");
});

fuck.on('end', function(station) {
    console.log(" 触发后 end 的回调 \n");
});

