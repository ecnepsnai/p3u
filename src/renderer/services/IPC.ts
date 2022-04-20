import { Options } from '../../shared/options';
import { Title } from '../types/Title';
import { RuntimeVersions } from '../types/Versions';

interface PreloadBridge {
    getTitle: () => Promise<string>
    lookupTitle: (titleID: string) => Promise<Title>
    saveSinglePackage: (defaultName: string) => Promise<string>
    saveMultiplePackages: () => Promise<string>
    errorDialog: (title: string, body: string, detail?: string) => Promise<void>
    beep: () => void
    ping: (id: string) => void
    listenForPong: (cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => void
    downloadPackage: (id: string, url: string, filePath: string) => void
    listenForDownloadProgress: (id: string, cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => void
    listenForDownloadFinished: (id: string, cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => void
    listenForDownloadFailed: (id: string, cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => void
    hashFile: (filePath: string) => Promise<string>
    checkForUpdates: () => Promise<string>
    openInBrowser: (url: string) => void;
    fatalError: (error: unknown, errorInfo: unknown) => void;
    runtimeVersions: () => Promise<RuntimeVersions>;
    getOptions: () => Promise<Options>;
    updateOptions: (options: Options) => Promise<void>;
}

interface preloadWindow {
    P3U: PreloadBridge
}

export class IPC {
    private static preload: PreloadBridge = (window as unknown as preloadWindow).P3U as PreloadBridge;

    public static getTitle(): Promise<string> {
        return IPC.preload.getTitle();
    }

    public static lookupTitle(titleID: string): Promise<Title> {
        return IPC.preload.lookupTitle(titleID);
    }

    public static saveSinglePackage(defaultName: string): Promise<string> {
        return IPC.preload.saveSinglePackage(defaultName);
    }

    public static saveMultiplePackages(): Promise<string> {
        return IPC.preload.saveMultiplePackages();
    }

    public static errorDialog(title: string, body: string, detail?: string): Promise<void> {
        return IPC.preload.errorDialog(title, body, detail);
    }

    public static beep(): void {
        return IPC.preload.beep();
    }

    public static ping(id: string): void {
        return IPC.preload.ping(id);
    }

    public static listenForPong(cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void): void {
        return IPC.preload.listenForPong(cb);
    }

    public static downloadPackage(id: string, url: string, filePath: string): void {
        return IPC.preload.downloadPackage(id, url, filePath);
    }

    public static listenForDownloadProgress(id: string, cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void): void {
        return IPC.preload.listenForDownloadProgress(id, cb);
    }

    public static listenForDownloadFinished(id: string, cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void): void {
        return IPC.preload.listenForDownloadFinished(id, cb);
    }

    public static listenForDownloadFailed(id: string, cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void): void {
        return IPC.preload.listenForDownloadFailed(id, cb);
    }

    public static hashFile(filePath: string): Promise<string> {
        return IPC.preload.hashFile(filePath);
    }

    public static checkForUpdates(): Promise<string> {
        return IPC.preload.checkForUpdates();
    }

    public static openInBrowser(url: string): void {
        return IPC.preload.openInBrowser(url);
    }

    public static fatalError(error: unknown, errorInfo: unknown): void {
        return IPC.preload.fatalError(error, errorInfo);
    }

    public static runtimeVersions(): Promise<RuntimeVersions> {
        return IPC.preload.runtimeVersions();
    }

    public static getOptions(): Promise<Options> {
        return IPC.preload.getOptions();
    }
    public static updateOptions(options: Options): Promise<void> {
        return IPC.preload.updateOptions(options);
    }
}
