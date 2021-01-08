import http = require('http');
import https = require('https');
import fs = require('fs');
import crypto = require('crypto');
import { shell, app, BrowserWindow, dialog, ipcMain } from 'electron';
import xml2js = require('xml2js');

const ca = '-----BEGIN CERTIFICATE-----\n' +
    'MIID0jCCArqgAwIBAgIBADANBgkqhkiG9w0BAQUFADBUMQswCQYDVQQGEwJKUDEp\n' +
    'MCcGA1UEChMgU29ueSBDb21wdXRlciBFbnRlcnRhaW5tZW50IEluYy4xGjAYBgNV\n' +
    'BAMTEVNDRUkgRE5BUyBSb290IDA1MB4XDTA0MDcxMjA5MDExOVoXDTM3MTIwNjA5\n' +
    'MDExOVowVDELMAkGA1UEBhMCSlAxKTAnBgNVBAoTIFNvbnkgQ29tcHV0ZXIgRW50\n' +
    'ZXJ0YWlubWVudCBJbmMuMRowGAYDVQQDExFTQ0VJIEROQVMgUm9vdCAwNTCCASIw\n' +
    'DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANmPeza8PwCqlI7esOGIkoSESnIN\n' +
    'g72ZD3Ut63jy7SdothPIvGBqVZWYkIpqJYJd1I4Nh//IpXQCQL0PnJLrh9BBeowq\n' +
    'Muf5NNq3Us80Ihiu9CvNEAEO18g3OFV1TYdSwQ5zUsk33OUeI7h4aBPDVcZXYeHt\n' +
    'dbPLqe4K8igian5prrAD5S6h28t8aAm+qMWRo+bW25B/841XwDGBP7/IxZv8Yoio\n' +
    'rCo80CVYe6lGoU08eeqQiaHI5zAF281DWZSoVfLjJUEWmEnxqr8aOhszRGePi+Ei\n' +
    '7UQjHDuZX9rLhDI1zAND+BA259tn/iwOqVXe20OccJllHJcG4Ecmd98f5qMCAwEA\n' +
    'AaOBrjCBqzAdBgNVHQ4EFgQUxlahM1tPzoN3YgVEhm0gV7Wv2twwfAYDVR0jBHUw\n' +
    'c4AUxlahM1tPzoN3YgVEhm0gV7Wv2tyhWKRWMFQxCzAJBgNVBAYTAkpQMSkwJwYD\n' +
    'VQQKEyBTb255IENvbXB1dGVyIEVudGVydGFpbm1lbnQgSW5jLjEaMBgGA1UEAxMR\n' +
    'U0NFSSBETkFTIFJvb3QgMDWCAQAwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQUF\n' +
    'AAOCAQEACZPihjwXA27wJ03tEKcHAeFLi8aBw2ysH4GwuH1dWb3UpuznWOB0iQT1\n' +
    'wQocnEFYCJx5XFEnj4aLWpSHLEq/sSO+my+aPoTEsy20ajF+YLYZm0bZxH50CJYh\n' +
    'rkET4C2aC0XvhGp9k1JQ1o0W6+cFT5LTlXapsq8Btt31t+XDPX7RqGV4WGekt3hM\n' +
    'T7xRc7JWXdAQijIrbYi8mtbM07KEGnPU6IT8C47+0mSurpwLOoWL1tPgo6ePpLNi\n' +
    'c4quUMgh9RXVjeTyXOMmyYdeUm2gt7qErvQONli+6Epmhm0A2khpIMHSpQjTE8gV\n' +
    'rZp42a6+zg1iYy2vFBOmiQ17GRUl0A==\n' +
    '-----END CERTIFICATE-----';

function getTitleXML(titleID: string) {
    const options: https.RequestOptions = {
        host: 'a0.ww.np.dl.playstation.net',
        port: 443,
        path: '/tpl/np/' + titleID + '/' + titleID + '-ver.xml',
        method: 'GET',
        ca: [ ca ],
    };
    options.agent = new https.Agent(options as https.AgentOptions);
    return new Promise((resolve, reject) => {
        console.log('HTTP GET https://' + options.host + options.path);
        const request = https.request(options, resp => {
            resp.setEncoding('utf8');
            let rawData = '';
            resp.on('data', chunk => { rawData += chunk; });
            resp.on('end', () => {
                resolve(rawData);
            });
        });
        request.on('error', e => {
            reject(e);
        });
        request.end();
    });
}

interface Tpackage {
    version: string,
    size: number,
    sha1_sum: string,
    url: string,
}

interface Ttitle {
    title_id: string,
    name: string,
    packages: Tpackage[],
}

ipcMain.handle('lookup_title', async (event, args) => {
    const titleID = args[0];
    const xmlData = await getTitleXML(titleID);
    const parser = new xml2js.Parser();
    const title: Ttitle = {
        title_id: titleID,
        name: '',
        packages: [],
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parser.parseString(xmlData, function(err: Error, result: any) {
        if (!result || !result.titlepatch) {
            throw new Error('No updates for package');
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            result.titlepatch.tag[0].package.forEach((elm: any) => {
                const pkg = elm.$;
                title.packages.push({
                    version: pkg.version,
                    size: parseInt(pkg.size),
                    sha1_sum: pkg.sha1sum,
                    url: pkg.url,
                });
                if (elm.paramsfo) {
                    const info = elm.paramsfo[0];
                    title.name = info.TITLE[0];
                }
            });
        } catch (e) {
            console.error('Error parsing XML for title', e);
            throw e;
        }
    });
    return title;
});


ipcMain.handle('save_single_package', async (event, args) => {
    const results = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
        title: 'Save Update Package',
        buttonLabel: 'Save',
        defaultPath: args[0],
        filters: [{
            name: 'Playstation 3 Package',
            extensions: [ 'pkg' ]
        }]
    });

    return results;
});

ipcMain.handle('save_multiple_packages', async () => {
    const results = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
        title: 'Select Download Location',
        buttonLabel: 'Download',
        properties: [ 'openDirectory', 'createDirectory' ]
    });

    return results;
});

ipcMain.handle('error_dialog', async (event, args) => {
    const results = await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
        type: 'error',
        title: args[0],
        message: args[1],
        detail: args[2],
    });

    return results;
});

ipcMain.on('alert', () => {
    if (BrowserWindow.getFocusedWindow()) {
        return;
    }

    const mainWindow = BrowserWindow.getAllWindows()[0];

    if (process.platform !== 'darwin') {
        mainWindow.once('focus', () => { mainWindow.flashFrame(false); });
        mainWindow.flashFrame(true);
    } else {
        app.dock.bounce();
    }
    shell.beep();
});

ipcMain.on('ping', (event, args) => {
    event.reply('pong', args);
});

ipcMain.on('download_package', (event, args) => {
    const id = args[0];
    const packageURL = args[1];
    const filePath = args[2];

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
                progressCallback((written/total) * 100);
            });

            resp.on('end', () => {
                console.info('Downloaded file', packageURL);
                fs.closeSync(f);
                event.reply('download_package_finished_' + id);
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
});

ipcMain.handle('hash_file', async (event, args) => {
    const filePath = args[0];

    return new Promise((resolve, reject) => {
        const options = fs.statSync(filePath);
        const max = options.size - 0x20;

        const hash = crypto.createHash('sha1');
        hash.setEncoding('hex');
        const stream = fs.createReadStream(filePath);

        let length = 0;
        stream.on('readable', () => {
            let chunk;
            while (length < max) {
                    const readL = Math.min(65536, max-length);
                    chunk = stream.read(readL);
                    if (!chunk) {
                            break;
                    }
                    length += chunk.length;
                    hash.write(chunk);
            }

            if (length == max) {
                    hash.end();
                    stream.close();
                    resolve(hash.read());
                    return;
            }
        });
        stream.on('error', e => {
            reject(e);
        });
    });
});
