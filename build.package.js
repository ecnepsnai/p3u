const { copyFileSync } = require('fs');
const path = require('path');

function copyFile(src, dst) {
    console.log('Copy file', {
        source: src,
        destination: dst
    });
    copyFileSync(src, dst);
}

function packageApp(platform, arch) {
    let packager = require('electron-packager');
    return packager({
        dir: '.',
        appCopyright: 'Copyright © Ian Spence 2021',
        arch: arch,
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
        afterCopy: [
            (buildPath, electronVersion, platform, arch, callback) => {
                copyFile(path.resolve('dist', 'index.html'), path.join(buildPath, 'dist', 'index.html'));
                callback();
            }
        ],
        ignore: [
            /\.es.*/,
            /\.git.*/,
            /LICENSE/,
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
            /run.js/,
            /tsconfig.json/,
            /webpack.[a-z]+.js/,
            /.*map/,
        ]
    });
}

exports.app = packageApp;
