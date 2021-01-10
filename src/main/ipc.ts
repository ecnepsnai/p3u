import { ipcMain } from 'electron';
import { Dialog } from './dialog';
import { Download } from './download';
import { Lookup } from './lookup';
import { Hash } from './hash';

ipcMain.handle('lookup_title', async (event, args) => {
    return Lookup.title(args[0]);
});

ipcMain.handle('save_single_package', async (event, args) => {
    return Dialog.showPackageSaveDialog(args[0]);
});

ipcMain.handle('save_multiple_packages', async () => {
    return Dialog.showSelectFolderDialog();
});

ipcMain.handle('error_dialog', async (event, args) => {
    return Dialog.showErrorDialog(args[0], args[1], args[2]);
});

ipcMain.on('beep', () => {
    Dialog.beep();
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
