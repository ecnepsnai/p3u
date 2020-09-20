import { Title } from '../types/Title';
import { IPC } from './ipc';

export class API {
    public static LookupTitle(titleID: string): Promise<Title> {
        return IPC.invoke('lookup_title', [titleID]).then(result => {
            return result as Title;
        });
    }

    public static DownloadPackage(url: string, filePath: string, progressCallback: (perc: number) => void): Promise<void> {
        return IPC.invoke('download_package', [url, filePath]).then(() => {
            return;
        });
    }
}