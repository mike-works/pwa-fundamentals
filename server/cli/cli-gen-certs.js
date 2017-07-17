const commander = require('commander');
const pkgJson = require('../../package.json');
const chalk = require('chalk');
const getDevelopmentCertificate = require('devcert-with-localhost').default;

const fs = require('fs');
const path = require('path');

const PRIVATE_FOLDER_PATH = path.join(__dirname, '..', '..', 'private');
const CERT_KEY_PATH = path.join(PRIVATE_FOLDER_PATH, 'key.pem');
const CERT_PATH = path.join(PRIVATE_FOLDER_PATH, 'cert.pem');

let program = commander
  .version(pkgJson.version)
  .name('./run gen-certs')
  .description('Frontend Grocer Build Tool: Certificate Generator');

program.parse(process.argv);

if (fs.existsSync(CERT_PATH)) {
  fs.unlinkSync(CERT_PATH);
}
if (fs.existsSync(CERT_KEY_PATH)) {
  fs.unlinkSync(CERT_KEY_PATH);
}

getDevelopmentCertificate('frontend-grocer', { installCertutil: true })
  .then(({key, cert}) => {
    fs.writeFileSync(CERT_PATH, cert);
    fs.writeFileSync(CERT_KEY_PATH, key);

    fs.chmodSync(CERT_PATH, '0400');
    fs.chmodSync(CERT_KEY_PATH, '0400');
    return true;
  }).catch((err) => {
    process.stderr.write(chalk.red(`Problem generating x509 certificates for HTTPS\n${err}\n`));
    process.exit(1);
  });