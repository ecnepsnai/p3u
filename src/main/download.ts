import http = require('http');
import fs = require('fs');

export class Download {
    public static package(id: string, packageURL: string, filePath: string, event: Electron.IpcMainEvent): void {
        let lastProgress = 0;
        const progressCallback = (n: number) => {
            if (n - lastProgress > 0.5) {
                event.reply('download_package_progress_' + id, [n]);
                lastProgress = n;
            }
        };

        const f = fs.openSync(filePath, 'w');
        try {
            let written = 0;
            console.log('Downloading file', packageURL, filePath);
            const request = http.get(packageURL, resp => {
                const total = parseInt(resp.headers['content-length']);

                resp.on('data', chunk => {
                    fs.writeFileSync(f, chunk);
                    written += chunk.length;
                    progressCallback((written / total) * 100);
                });

                resp.on('end', () => {
                    console.info('Downloaded file', packageURL);
                    fs.closeSync(f);
                    event.reply('download_package_finished_' + id, [filePath]);
                });

                resp.on('error', e => {
                    console.error(e);
                    fs.closeSync(f);
                    event.reply('download_package_failed_' + id, e);
                });
            });
            request.on('error', e => {
                console.error(e);
                fs.closeSync(f);
                event.reply('download_package_failed_' + id, e);
            });
            request.end();
        } catch (e) {
            console.error(e);
            fs.closeSync(f);
            event.reply('download_package_failed_' + id, e);
        }
    }
}