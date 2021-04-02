import { Title } from '../types/Title';
import { IPC } from './IPC';
import { Rand } from './Rand';

export class API {
    public static LookupTitle(titleID: string): Promise<Title> {
        return IPC.lookupTitle(titleID);
    }

    public static Test(): Promise<void> {
        const id = Rand.ID();

        return new Promise(resolve => {
            IPC.listenForPong((event, args: string[]) => {
                if (args[0] === id) {
                    resolve();
                }
            });

            IPC.ping(id);
        });
    }

    public static DownloadPackage(url: string, filePath: string, progressCallback: (perc: number) => void): Promise<string> {
        const downloadID = Rand.ID();
        return new Promise((resolve, reject) => {
            IPC.listenForDownloadProgress(downloadID, (event, args: number[]) => {
                const progress = args[0];
                progressCallback(progress);
            });

            IPC.listenForDownloadFinished(downloadID, (event, args: string[]) => {
                resolve(args[0]);
            });

            IPC.listenForDownloadFailed(downloadID, (event, args: string[]) => {
                const error = args[0];
                reject(error);
            });

            IPC.downloadPackage(downloadID, url, filePath);
        });
    }
}
