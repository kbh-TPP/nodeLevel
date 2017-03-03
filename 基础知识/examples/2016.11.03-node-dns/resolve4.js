var dns = require('dns');

dns.resolve4('www.qq.com', function (err, address) {
    if (err)
        throw err;

    // ["14.215.177.37","14.215.177.38"]
    console.log(JSON.stringify(address));
});