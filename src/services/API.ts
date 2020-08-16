import http = require('http');
import { Title } from '../types/Title';
import fs = require('fs');
import { ipcRenderer } from 'electron';

export class API {
    public static LookupTitle(titleID: string): Promise<Title> {
        return ipcRenderer.invoke('lookup_title', [titleID]).then(result => {
            return result as Title;
        });
    }

    public static DownloadPackage(url: string, filePath: string, progressCallback: (perc: number) => void): Promise<void> {
        const f = fs.openSync(filePath, 'w');

        return new Promise((resolve, reject) => {
            try {
                let written = 0;
                const request = http.get(url, resp => {
                    const total = parseInt(resp.headers['content-length']);
                    resp.on('data', chunk => {
                        fs.writeFileSync(f, chunk);
                        written += chunk.length;
                        progressCallback((written/total) * 100);
                    });
                    resp.on('end', () => {
                        fs.closeSync(f);
                        resolve();
                    });

                    resp.on('error', e => {
                        console.error(e);
                        reject(e);
                    });
                });
                request.on('error', e => {
                    console.error(e);
                    reject(e);
                });
                request.end();
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }
}