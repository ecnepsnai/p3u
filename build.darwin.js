const packager = require('./build.package.js');
const createDMG = require('electron-installer-dmg');

async function build(arch) {
    await packager.app('darwin', arch);
    await createDMG({
        appPath: 'package/PlayStation 3 Updater-darwin-' + arch + '/PlayStation 3 Updater.app',
        name: 'PlayStation 3 Updater',
        title: 'PlayStation 3 Updater',
        icon: 'icons/P3U.icns',
        format: 'ULFO',
        out: 'package/artifacts'
    });
    await packager.exec('mv', ['package/artifacts/PlayStation 3 Updater.dmg', 'package/artifacts/P3U_macOS_' + arch + '.dmg']);
}

(async function main() {
    try {
        await packager.exec('mkdir', ['-p', 'package/artifacts']);
        await build('x64');
        await build('arm64');
    } catch (err) {
        console.error(err);
    }
})();
