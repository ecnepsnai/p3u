const macInstaller = require('electron-installer-dmg');
const packager = require('./build.package.js');

(async function main() {
    await packager.app('darwin').then(() => {
        macInstaller({
            appPath: 'package/PlayStation 3 Updater-darwin-x64/PlayStation 3 Updater.app',
            name: 'PlayStation 3 Updater',
            out: 'package/artifacts',
            icon: 'icons/P3U.icns'
        });
    }, function(err) {
        console.error(err);
    }).catch(function(err) {
        console.error(err);
    });
})();
