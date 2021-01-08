import { app, BrowserWindow } from 'electron';
import path = require('path');
import fs = require('fs');
import os = require('os');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    console.info('Quitting because of squirrel');
    app.quit();
}

const createWindow = (): void => {
    console.log('Creating window');

    const options: Electron.BrowserWindowConstructorOptions = {
        height: 600,
        width: 800,
        webPreferences: {
            sandbox: true,
            preload: path.join(fs.realpathSync('.'), 'dist', 'preload.js'),
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
        },
        title: 'PlayStation 3 Updater',
        show: false
    };

    if (os.platform() !== 'win32') {
        options.icon = path.join(fs.realpathSync('.'), 'dist', 'icons', 'P3U.png');
    } else {
        options.icon = path.join(fs.realpathSync('.'), 'dist', 'icons', 'P3U.ico');
    }

    // Create the browser window.
    const mainWindow = new BrowserWindow(options);

    // and load the index.html of the app.
    mainWindow.loadFile(path.join('dist', 'index.html')).then(() => {
        console.log('index loaded!');
    }, e => {
        console.error('Error loading', e);
    }).catch(e => {
        console.error('Error loading', e);
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        console.log('All windows closed');
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
