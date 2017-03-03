var dns = require('dns');
dns.lookupService('127.0.0.1', 80, function (err, hostname, service) {
    if (err)
        console.log(err);

    console.log('该IP对应的主机为：' + hostname + ' 协议为:' + service);
});


// dns.reverse('58.63.236.248', function (err, hostnames) {
//     if (err)
//         throw err;
//     console.log(hostnames);//结果为[ 'public1.114dns.com' ]
// });