const windowsInstaller = require('electron-winstaller');
const packager = require('./build.package.js');

(async function main() {
    await packager.app('win32', 'x64');
    await windowsInstaller.createWindowsInstaller({
        appDirectory: 'package\\PlayStation 3 Updater-win32-x64',
        outputDirectory: 'package\\artifacts',
        title: 'PlayStation 3 Updater',
        iconUrl: 'https://raw.githubusercontent.com/ecnepsnai/p3u/develop/icons/P3U.ico',
        setupIcon: 'icons\\P3U.ico',
        exe: 'p3u.exe',
        setupExe: 'P3U_windows_x64.exe',
        noMsi: true
    });
})();
