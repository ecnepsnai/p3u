import { Package } from "../types/Title";
import { remote } from 'electron';
import { API } from "./API";
import { Security } from "./Security";

export class Downloader {
    public static DownloadPackage(pkg: Package, progress: (perc: number) => void): Promise<boolean> {
        const parts = pkg.url.split('//');
        const name = parts[parts.length-1];
        const result = remote.dialog.showSaveDialogSync(remote.BrowserWindow.getFocusedWindow(), {
            title: 'Save Update Package',
            buttonLabel: 'Save',
            defaultPath: name,
            filters: [
                {
                    name: 'Playstation 3 Package',
                    extensions: [ 'pkg' ]
                }
            ]
        });
        if (result == undefined) {
            return Promise.resolve(false);
        }

        return new Promise((resolve, reject) => {
            API.DownloadPackage(pkg.url, result, progress).then(() => {
                Security.hashPackage(result).then(fileHash => {
                    if (fileHash.toLowerCase() !== pkg.sha1_sum.toLowerCase()) {
                        console.error('File integrity failure! File hash "' + fileHash + '" did not match expected hash "' + pkg.sha1_sum + '"');
                        reject('File integrity failure');
                        return;
                    }
                    resolve(true);
                }, reject);
            }, reject);
        });
    }
}
