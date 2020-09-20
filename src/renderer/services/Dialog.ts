const ipcRenderer = (window as any).ipcRenderer as Electron.IpcRenderer;

interface SaveFileDialogResult {
    canceled: boolean;
    filePath: string;
}

interface SelectFolderDialogResult {
    canceled: boolean;
    filePaths: string[];
}

export class Dialog {
    public static SavePackage(defaultName: string): Promise<SaveFileDialogResult> {
        return ipcRenderer.invoke('save_single_package', [defaultName]);
    }

    public static SaveAllPackages(): Promise<SelectFolderDialogResult> {
        return ipcRenderer.invoke('save_multiple_packages');
    }

    public static Error(title: string, body: string, detail?: string): void {
        ipcRenderer.invoke('error_dialog', [title, body, detail]).then();
    }
}