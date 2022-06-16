import { shell, BrowserWindow, dialog, app } from 'electron';
import path = require('path');
import { OptionsManager } from './options_manager';

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
    public async showPackageSaveDialog(defaultName: string): Promise<string> {
        if (!OptionsManager.Get().AskForDownloadLocation) {
            return Promise.resolve(path.join(app.getPath('downloads'), defaultName));
        }

        const result = await dialog.showSaveDialog(this.parent, {
            title: 'Save Update Package',
            buttonLabel: 'Save',
            defaultPath: defaultName,
            filters: [{
                name: 'PlayStation 3 Package',
                extensions: ['pkg']
            }]
        });

        if (result.canceled) {
            return undefined;
        }

        return result.filePath;
    }

    /**
     * Show a select folder dialog for downloading multiple packages
     * @returns A promise that resolves with the result of the save file dialog
     */
    public async showSelectFolderDialog(): Promise<string> {
        if (!OptionsManager.Get().AskForDownloadLocation) {
            return Promise.resolve(app.getPath('downloads'));
        }

        const result = await dialog.showOpenDialog(this.parent, {
            title: 'Select Download Location',
            buttonLabel: 'Download',
            properties: ['openDirectory', 'createDirectory']
        });

        if (result.canceled || result.filePaths.length != 1) {
            return undefined;
        }

        return result.filePaths[0];
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

        this.parent.once('focus', () => {
            this.parent.flashFrame(false);
        });
        this.parent.flashFrame(true);
        shell.beep();
    }

    /**
     * Show a dialog for fatal errors.
     */
    public showFatalErrorDialog = async (): Promise<void> => {
        const result = await dialog.showMessageBox(this.parent, {
            type: 'error',
            buttons: [
                'Report Error & Restart',
                'Restart PlayStation 3 Updater'
            ],
            defaultId: 0,
            cancelId: 1,
            title: 'Fatal Error',
            message: 'A non-recoverable error occurred and PlayStation 3 Updater must restart. Any unsaved work will be lost. '
        });

        if (result.response == 0) {
            shell.openExternal('https://github.com/ecnepsnai/p3u/issues');
        }

        return;
    };
}