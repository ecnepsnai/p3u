/* eslint-disable @typescript-eslint/no-explicit-any */
export class IPC {
    private static ipcRenderer = (window as any).ipcRenderer as Electron.IpcRenderer;

    public static invoke(channel: string, ...args: any[]): Promise<any> {
        return IPC.ipcRenderer.invoke(channel, args);
    }
}
