const windowsInstaller = require('electron-winstaller');
const package = require('./package.json');
const packager = require('./release-package.js');

(async function main() {
    await packager.app('win32').then(() => {
        return windowsInstaller.createWindowsInstaller({
            appDirectory: 'package/PlayStation 3 Updater-win32-x64',
            outputDirectory: 'package/artifacts',
            title: 'PlayStation 3 Updater',
            iconUrl: 'https://raw.githubusercontent.com/ecnepsnai/p3u/master/icons/P3U.ico',
            setupIcon: 'icons/P3U.ico',
            exe: 'P3U.exe',
            setupExe: 'P3U-' + package.version + '.exe',
        }, function(err) {
            console.error(err);
        }).catch(function(err) {
            console.error(err);
        });
    }, function(err) {
        console.error(err);
    }).catch(function(err) {
        console.error(err);
    });
})();
