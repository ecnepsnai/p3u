import { BrowserWindow, ipcMain, shell, WebContents } from 'electron';
import { Dialog } from './dialog';
import { Download } from './download';
import { Lookup } from './lookup';
import { Hash } from './hash';
import { Updater } from './updater';
import * as manifest from '../../package.json';
import { OptionsManager } from './options_manager';
import { Options } from '../shared/options';

const browserWindowFromEvent = (sender: WebContents): BrowserWindow => {
    const windows = BrowserWindow.getAllWindows().filter(window => window.webContents.id === sender.id);
    return windows[0];
};

ipcMain.handle('get_title', event => {
    const window = browserWindowFromEvent(event.sender);
    return Promise.resolve(window.title);
});

ipcMain.handle('lookup_title', async (event, args) => {
    event.sender.id;
    return Lookup.title(args[0]);
});

ipcMain.handle('save_single_package', async (event, args) => {
    return new Dialog(browserWindowFromEvent(event.sender)).showPackageSaveDialog(args[0]);
});

ipcMain.handle('save_multiple_packages', async (event) => {
    return new Dialog(browserWindowFromEvent(event.sender)).showSelectFolderDialog();
});

ipcMain.handle('error_dialog', async (event, args) => {
    return new Dialog(browserWindowFromEvent(event.sender)).showErrorDialog(args[0], args[1], args[2]);
});

ipcMain.on('beep', (event) => {
    new Dialog(browserWindowFromEvent(event.sender)).beep();
});

ipcMain.on('ping', (event, args) => {
    event.reply('pong', args);
});

ipcMain.on('download_package', (event, args) => {
    Download.package(args[0], args[1], args[2], event);
});

ipcMain.handle('hash_file', async (event, args) => {
    return Hash.file(args[0]);
});

ipcMain.handle('check_for_updates', async () => {
    const newerVersion = await Updater.GetNewerRelease();

    if (newerVersion == undefined) {
        return undefined;
    }

    return newerVersion.ReleaseURL;
});

ipcMain.on('open_in_browser', (event, args) => {
    shell.openExternal(args[0]);
});

ipcMain.on('fatal_error', (event, args) => {
    const error = args[0] as Error;
    const errorInfo = args[1] as React.ErrorInfo;
    console.error('Fatal error from renderer: ' + error + errorInfo.componentStack);
    const window = browserWindowFromEvent(event.sender);

    new Dialog(window).showFatalErrorDialog().then(() => {
        window.reload();
    });
});

ipcMain.handle('runtime_versions', async () => {
    const app = manifest.version;
    const electron = manifest.dependencies.electron;
    const nodejs = process.version.substr(1);

    return {
        app: app,
        electron: electron,
        nodejs: nodejs,
    };
});

ipcMain.handle('get_options', async () => {
    return OptionsManager.Get();
});

ipcMain.handle('update_options', async (event, args) => {
    const newValue = args[0] as Options;
    return OptionsManager.Set(newValue);
});
