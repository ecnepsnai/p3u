import { ipcRenderer, remote } from 'electron';

export class Notify {
    public static Now(): void {
        if (!remote.BrowserWindow.getFocusedWindow) {
            ipcRenderer.send('alert', '');
        }
    }
}