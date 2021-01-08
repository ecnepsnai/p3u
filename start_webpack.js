const { exec } = require('child_process');

let watch = false;
let mode = 'development';

for (var i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === '--watch') {
        watch = true;
    } else if (arg === '--mode') {
        mode = process.argv[i+1];
        i+1;
    }
}

var startWebpack = (configFile) => {
    return new Promise(resolve => {
        let command = 'npx webpack --config ' + configFile;
        if (mode !== 'development') {
            command += ' --mode ' + mode;
        }
        if (watch) {
            command += ' --watch'
        }
        exec(command, () => { resolve(); });
    });
}

var startMain = () => {
    return startWebpack('webpack.main.js')
}

var startPreload = () => {
    return startWebpack('webpack.preload.js')
}

var startRenderer = () => {
    return startWebpack('webpack.renderer.js')
}

(async() => {
    await Promise.all([startMain(), startPreload(), startRenderer()]);
})();
