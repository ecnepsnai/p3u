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
            IPC.listenForPong((event, args) => {
                if (args[0] === id) {
                    resolve();
                }
            });

            IPC.ping(id);
        });
    }

    public static DownloadPackage(url: string, filePath: string, progressCallback: (perc: number) => void): Promise<void> {
        const downloadID = Rand.ID();
        return new Promise((resolve, reject) => {
            IPC.listenForDownloadProgress(downloadID, (event, args) => {
                const progress = args[0] as number;
                progressCallback(progress);
            });

            IPC.listenForDownloadFinished(downloadID, () => {
                resolve();
            });

            IPC.listenForDownloadFailed(downloadID, (event, args) => {
                const error = args[0] as string;
                reject(error);
            });

            IPC.downloadPackage(downloadID, url, filePath);
        });
    }
}
