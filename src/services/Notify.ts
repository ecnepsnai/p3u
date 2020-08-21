import { ipcRenderer } from 'electron';

export class Notify {
    public static Now(): void {
        ipcRenderer.send('alert');
    }
}