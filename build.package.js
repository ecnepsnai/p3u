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
        overwrite: false,
        platform: platform,
        appBundleId: 'io.ecn.p3u',
        appCategoryType: 'public.app-category.entertainment',
        osxSign: false,
        asar: true,
        darwinDarkModeSupport: true,
        executableName: 'P3U'
    });
}

exports.app = packageApp;
