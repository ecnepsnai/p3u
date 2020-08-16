import { remote } from 'electron';

export class Dialog {
    public static SavePackage(defaultName: string): string {
        return remote.dialog.showSaveDialogSync(remote.BrowserWindow.getFocusedWindow(), {
            title: 'Save Update Package',
            buttonLabel: 'Save',
            defaultPath: defaultName,
            filters: [
                {
                    name: 'Playstation 3 Package',
                    extensions: [ 'pkg' ]
                }
            ]
        });
    }

    public static SaveAllPackages(): string {
        const result = remote.dialog.showOpenDialogSync(remote.BrowserWindow.getFocusedWindow(), {
            title: 'Select Download Location',
            buttonLabel: 'Download Packages',
            properties: [ 'openDirectory', 'createDirectory' ]
        });
        if (!result) {
            return null;
        }
        return result[0];
    }

    public static Error(title: string, body: string, detail?: string): void {
        remote.dialog.showMessageBoxSync(remote.BrowserWindow.getFocusedWindow(), {
            type: 'error',
            title: title,
            message: body,
            detail: detail,
        });
    }
}