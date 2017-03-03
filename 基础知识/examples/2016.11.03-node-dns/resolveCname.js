var dns = require('dns');

dns.resolveCname('www.baidu.com', function (err, address) {
    if (err)
        throw err;

    console.log(JSON.stringify(address));
});

// var list1 = dns.getServers();
// console.log(list1);
//
// dns.setServers([ '127.0.0.1']);
//
// var list2 = dns.getServers();
//
// console.log(list2);