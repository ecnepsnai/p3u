import { shell, BrowserWindow, dialog, app } from 'electron';

export class Dialog {
    /**
     * Show a save file dialog for saving a single PlayStation 3 Package
     * @param defaultName the name of the file to use by default
     * @returns A promise that resolves with the result of the save file dialog
     */
    public static async showPackageSaveDialog(defaultName: string): Promise<Electron.SaveDialogReturnValue> {
        return dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
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
    public static async showSelectFolderDialog(): Promise<Electron.OpenDialogReturnValue> {
        return dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
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
    public static async showErrorDialog(title: string, body: string, details: string): Promise<Electron.MessageBoxReturnValue> {
        return dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            type: 'error',
            title: title,
            message: body,
            detail: details,
        });
    }

    /**
     * 'Beep' the current window.
     */
    public static beep(): void {
        if (BrowserWindow.getFocusedWindow()) {
            return;
        }

        const mainWindow = BrowserWindow.getAllWindows()[0];

        if (process.platform !== 'darwin') {
            mainWindow.once('focus', () => { mainWindow.flashFrame(false); });
            mainWindow.flashFrame(true);
        } else {
            app.dock.bounce();
        }
        shell.beep();
    }
}