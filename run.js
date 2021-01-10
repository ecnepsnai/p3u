const { spawn } = require('child_process');
const path = require('path');

function start() {
    return new Promise(resolve => {
        const file = path.resolve('node_modules', '.bin', 'electron');
        const args = [path.join('dist', 'main.js')];
        const env = process.env;
        env['DEVELOPMENT'] = '1';
        console.log(file, args);
        const electron = spawn(file, args, { stdio: 'inherit', env: env });
        electron.on('close', () => {
            resolve();
        });
    });
}

(async () => {
    await start();
})();
