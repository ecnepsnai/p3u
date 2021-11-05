const packager = require('./build.package.js');
const info = require('./package.json');

async function build(arch) {
    await packager.app('linux', arch);
    await packager.exec('tar', ['-czf', 'P3U_linux_' + info.version + '_' + arch + '.tar.gz', 'PlayStation 3 Updater-linux-' + arch], { cwd: 'package/' });
    await packager.exec('mkdir', ['-p', 'package/artifacts']);
    await packager.exec('mv', ['package/P3U_linux_' + info.version + '_' + arch + '.tar.gz', 'package/artifacts']);
}

async function make_pkg() {
    await packager.exec('./build.sh', [info.version], { cwd: 'docker/' });
}

(async function main() {
    try {
        await packager.exec('mkdir', ['-p', 'package/artifacts']);
        await build('x64');
        await make_pkg();
    } catch (err) {
        console.error(err);
    }
})();
