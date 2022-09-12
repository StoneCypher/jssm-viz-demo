
const fs = require('fs');

const package = JSON.parse(fs.readFileSync('package.json'));

fs.writeFileSync('./docs/version.js', `
const version    = "${package.version}",
      build_time = ${new Date().getTime()};

if (module) { module.exports = { version, build_time }; }
`);
