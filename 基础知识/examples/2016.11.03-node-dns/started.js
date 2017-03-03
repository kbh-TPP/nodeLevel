var dns = require('dns');
var domain = 'www.qq.com';
var ip = '127.0.0.1';
var port = 80;

// 会受到本地host影响
dns.lookup('www.qq.com', function onLookup(err, addresses, family) {
    if (err) throw err;
    console.log('addresses from lookup:', addresses);
});

// 不会收到本地host影响
dns.resolve4('www.qq.com', function (err, addresses) {
    if (err) throw err;
    console.log('addresses from resolve4: ' + JSON.stringify(addresses));
});

// 通过ip反查域名
dns.lookupService(ip, port, function (err, hostname, service) {
    try {
        if (err)
            throw err;

        console.log('该IP对应的主机为：'+ hostname + ' 协议为:' + service);
    } catch (error) {

        console.log(error);
    }
});