import { shell, BrowserWindow, dialog } from 'electron';
import { App } from './app';
import { Paths } from './paths';

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
                extensions: ['pkg']
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
            properties: ['openDirectory', 'createDirectory']
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

    /**
     * Prepare an electron modal browser window
     * @param title The title of the window
     * @param height The height of the window
     * @param width The width of the window
     * @returns A promise that resolves with the browser window object when the window was shown to the user
     */
    private electronModal(title: string, height: number, width: number): Promise<BrowserWindow> {
        return new Promise((resolve, reject) => {
            const paths = Paths.default();
            const modalWindow = new BrowserWindow({
                parent: this.parent,
                height: height,
                width: width,
                resizable: false,
                maximizable: false,
                minimizable: false,
                webPreferences: {
                    sandbox: true,
                    preload: paths.preloadJS,
                    contextIsolation: true,
                },
                autoHideMenuBar: true,
                modal: true,
                title: title,
                icon: paths.icon,
                show: false
            });
            modalWindow.loadFile(paths.indexHTML).then(() => {
                //
            }, e => {
                console.error('Error loading index HTML', e);
                reject(e);
            }).catch(e => {
                console.error('Error loading index HTML', e);
                reject(e);
            });

            if (!App.isProduction()) {
                modalWindow.webContents.openDevTools();
            }

            modalWindow.on('ready-to-show', () => {
                modalWindow.show();
                resolve(modalWindow);
            });
        });
    }

    public showAboutModal(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.electronModal('About', 270, 640).then(importWindow => {
                importWindow.on('closed', () => {
                    resolve();
                });
            }).catch(err => {
                reject(err);
            });
        });
    }
}