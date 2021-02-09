const { spawn } = require('child_process');

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
        const args = ['webpack', '--config', configFile];
        const env = process.env;

        if (mode === 'production') {
            args.push('--mode', 'production');
            env['DEVELOPMENT'] = '1';
        }
        if (watch) {
            args.push('--watch');
        }

        console.log('npx', args);

        const electron = spawn('npx', args, { stdio: 'inherit', env: env });
        electron.on('close', () => {
            resolve();
        });
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
