const { copyFileSync } = require('fs');
const path = require('path');

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
                copyFileSync(path.join('.', 'dist', 'index.html'), path.join(buildPath, 'dist', 'index.html'));
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
            /build.darwin.js/,
            /build.flatpak.js/,
            /build.package.js/,
            /build.windows.js/,
            /package-lock.json/,
            /README.md/,
            /start_webpack.js/,
            /tsconfig.json/,
            /webpack.main.js/,
            /webpack.preload.js/,
            /webpack.renderer.js/,
            /.*map/,
        ]
    });
}

exports.app = packageApp;
