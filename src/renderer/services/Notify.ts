const ipcRenderer = (window as any).ipcRenderer as Electron.IpcRenderer;

export class Notify {
    public static Now(): void {
        ipcRenderer.send('alert');
    }
}