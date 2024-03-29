const installer = require('electron-installer-redhat')

const options = {
    src: '/build_root/package/PlayStation 3 Updater-linux-x64/',
    dest: '/build_root/package/artifacts/',
    arch: 'x86_64',
    icon: '/build_root/package/PlayStation 3 Updater-linux-x64/resources/app/dist/assets/P3U.png'
}

async function main (options) {
    console.log('Building .rpm package...')

    try {
        await installer(options)
        console.log('Finished')
    } catch (err) {
        console.error(err, err.stack)
        process.exit(1)
    }
}
main(options)