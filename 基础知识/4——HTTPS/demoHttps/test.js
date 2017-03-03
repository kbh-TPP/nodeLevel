


const CertManager = require('node-easy-cert');

const options = {
  rootDirPath: './', 
  // default to /{USER_HOME}/{.node_easy_certs}/ 
  // the default attrs of a generated cert, you can change it here 
  defaultCertAttrs: [
    { name: 'countryName', value: 'CN' },
    { name: 'organizationName', value: 'CertManager' },
    { shortName: 'ST', value: 'SH' },
    { shortName: 'OU', value: 'CertManager SSL' }
  ]
}
 
const crtMgr = new CertManager(options);
const rootOptions = {
  commonName: 'theNameYouLike'
};
 
// crtMgr.generateRootCA(rootOptions);

// console.log(crtMgr.getRootDirPath());


console.log(crtMgr.ifRootCATrusted());
