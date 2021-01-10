import { shell, BrowserWindow, dialog, app } from 'electron';

export class Dialog {
    private parent: BrowserWindow;
    constructor(parent: BrowserWindow) {
        this.parent = parent;
    }

    /**
     * Show a save file dialog for saving a single PlayStation 3 Package
     * @param defaultName the name of the file to use by default
     * @returns A promise that resolves with the result of the save file dialog
     */
    public async showPackageSaveDialog(defaultName: string): Promise<Electron.SaveDialogReturnValue> {
        return dialog.showSaveDialog(this.parent, {
            title: 'Save Update Package',
            buttonLabel: 'Save',
            defaultPath: defaultName,
            filters: [{
                name: 'PlayStation 3 Package',
                extensions: [ 'pkg' ]
            }]
        });
    }

    /**
     * Show a select folder dialog for downloading multiple packages
     * @returns A promise that resolves with the result of the save file dialog
     */
    public async showSelectFolderDialog(): Promise<Electron.OpenDialogReturnValue> {
        return dialog.showOpenDialog(this.parent, {
            title: 'Select Download Location',
            buttonLabel: 'Download',
            properties: [ 'openDirectory', 'createDirectory' ]
        });
    }

    /**
     * Show an error dialog
     * @param title The title of the dialog
     * @param body The body of the error message
     * @param details Additional details for the error message
     */
    public async showErrorDialog(title: string, body: string, details: string): Promise<Electron.MessageBoxReturnValue> {
        return dialog.showMessageBox(this.parent, {
            type: 'error',
            title: title,
            message: body,
            detail: details,
        });
    }

    /**
     * 'Beep' the current window.
     */
    public beep(): void {
        if (this.parent.isFocused) {
            return;
        }

        if (process.platform !== 'darwin') {
            this.parent.once('focus', () => { this.parent.flashFrame(false); });
            this.parent.flashFrame(true);
        } else {
            app.dock.bounce();
        }
        shell.beep();
    }
}