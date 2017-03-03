var fs = require('fs');
var zlib = require('zlib');

var input = "hello world";
var output = zlib.gzipSync(input);

console.log('gziped output content: ' + output);

var out = zlib.gunzipSync(output);

console.log('guziped out content: ' + out);