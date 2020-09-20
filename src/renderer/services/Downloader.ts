import { Package } from "../types/Title";
import { API } from "./API";
import { Security } from "./Security";

export class Downloader {
    public static DownloadPackage(pkg: Package, filePath: string, progress: (perc: number) => void): Promise<boolean> {
        return new Promise((resolve, reject) => {
            API.DownloadPackage(pkg.url, filePath, progress).then(() => {
                Security.hashPackage(filePath).then(fileHash => {
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
