import { Package } from "../types/Title";
import { remote } from 'electron';
import { API } from "./API";

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

        return API.DownloadPackage(pkg.url, result, progress);
    }
}
