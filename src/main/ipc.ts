import { BrowserWindow, ipcMain, shell, webContents } from 'electron';
import { Dialog } from './dialog';
import { Download } from './download';
import { Lookup } from './lookup';
import { Hash } from './hash';
import { Updater } from './updater';

const browserWindowFromEvent = (sender: webContents): BrowserWindow => {
    const windows = BrowserWindow.getAllWindows().filter(window => window.webContents.id === sender.id);
    return windows[0];
};

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
