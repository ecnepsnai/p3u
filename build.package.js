const { copyFileSync } = require('fs');
const path = require('path');

function copyFile(src, dst) {
    console.log('Copy file', {
        source: src,
        destination: dst
    });
    copyFileSync(src, dst);
}

function packageApp(platform) {
    console.info('Packaging application for ' + platform);
    let packager = require('electron-packager');
    return packager({
        dir: '.',
        appCopyright: 'Copyright © Ian Spence 2020',
        arch: 'x64',
        icon: 'icons/P3U',
        name: 'PlayStation 3 Updater',
        out: 'package',
        overwrite: true,
        platform: platform,
        appBundleId: 'io.ecn.p3u',
        appCategoryType: 'public.app-category.entertainment',
        osxSign: false,
        darwinDarkModeSupport: true,
        executableName: 'p3u',
        asar: true,
        afterCopy: [
            (buildPath, electronVersion, platform, arch, callback) => {
                copyFile(path.resolve('dist', 'index.html'), path.join(buildPath, 'dist', 'index.html'));
                copyFile(path.resolve('dist', 'preload.js'), path.join(buildPath, 'dist', 'preload.js'));
                callback();
            }
        ],
        ignore: [
            /css/,
            /html/,
            /icons/,
            /node_modules/,
            /src/,
            /add_module.js/,
            /build.[a-z]+.js/,
            /package-lock.json/,
            /README.md/,
            /start_webpack.js/,
            /tsconfig.json/,
            /webpack.[a-z]+.js/,
            /.*map/,
        ]
    });
}

exports.app = packageApp;
