/* eslint-disable @typescript-eslint/no-explicit-any */

import { Title } from "../types/Title";

interface SaveFileDialogResult {
    canceled: boolean;
    filePath: string;
}

interface SelectFolderDialogResult {
    canceled: boolean;
    filePaths: string[];
}

interface PreloadBridge {
    lookupTitle: (titleID: string) => Promise<Title>
    saveSinglePackage: (defaultName: string) => Promise<SaveFileDialogResult>
    saveMultiplePackages: () => Promise<SelectFolderDialogResult>
    errorDialog: (title: string, body: string, detail?: string) => Promise<void>
    alert: () => void
    ping: (id: string) => void
    listenForPong: (cb: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void
    downloadPackage: (id: string, url: string, filePath: string) => void
    listenForDownloadProgress: (id: string, cb: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void
    listenForDownloadFinished: (id: string, cb: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void
    listenForDownloadFailed: (id: string, cb: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void
    hashFile: (filePath: string) => Promise<string>
}

interface preloadWindow {
    P3U: PreloadBridge
}

export class IPC {
    private static preload: PreloadBridge = (window as unknown as preloadWindow).P3U as PreloadBridge;

    public static lookupTitle(titleID: string): Promise<Title> {
        return IPC.preload.lookupTitle(titleID);
    }

    public static saveSinglePackage(defaultName: string): Promise<SaveFileDialogResult> {
        return IPC.preload.saveSinglePackage(defaultName);
    }

    public static saveMultiplePackages(): Promise<SelectFolderDialogResult> {
        return IPC.preload.saveMultiplePackages();
    }

    public static errorDialog(title: string, body: string, detail?: string): Promise<void> {
        return IPC.preload.errorDialog(title, body, detail);
    }

    public static alert(): void {
        return IPC.preload.alert();
    }

    public static ping(id: string): void {
        return IPC.preload.ping(id);
    }

    public static listenForPong(cb: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void {
        return IPC.preload.listenForPong(cb);
    }

    public static downloadPackage(id: string, url: string, filePath: string): void {
        return IPC.preload.downloadPackage(id, url, filePath);
    }

    public static listenForDownloadProgress(id: string, cb: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void {
        return IPC.preload.listenForDownloadProgress(id, cb);
    }

    public static listenForDownloadFinished(id: string, cb: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void {
        return IPC.preload.listenForDownloadFinished(id, cb);
    }

    public static listenForDownloadFailed(id: string, cb: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void {
        return IPC.preload.listenForDownloadFailed(id, cb);
    }

    public static hashFile(filePath: string): Promise<string> {
        return IPC.preload.hashFile(filePath);
    }
}
