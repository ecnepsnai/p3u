const packager = require('./build.package.js');

(async function main() {
    await packager.app('linux').then();
})();