import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('P3U', {
    getTitle: () => ipcRenderer.invoke('get_title', []),
    lookupTitle: (titleID) => ipcRenderer.invoke('lookup_title', [titleID]),
    saveSinglePackage: (defaultName) => ipcRenderer.invoke('save_single_package', [defaultName]),
    saveMultiplePackages: () => ipcRenderer.invoke('save_multiple_packages', []),
    errorDialog: (title, body, detail) => ipcRenderer.invoke('error_dialog', [title, body, detail]),
    beep: () => ipcRenderer.send('beep'),
    ping: (id) => ipcRenderer.send('ping', [id]),
    listenForPong: (cb) => ipcRenderer.on('pong', cb),
    downloadPackage: (id, url, filePath) => ipcRenderer.send('download_package', [id, url, filePath]),
    listenForDownloadProgress: (id, cb) => ipcRenderer.on('download_package_progress_' + id, cb),
    listenForDownloadFinished: (id, cb) => ipcRenderer.on('download_package_finished_' + id, cb),
    listenForDownloadFailed: (id, cb) => ipcRenderer.on('download_package_failed_' + id, cb),
    hashFile: (filePath) => ipcRenderer.invoke('hash_file', [filePath]),
    checkForUpdates: () => ipcRenderer.invoke('check_for_updates'),
    openInBrowser: (url) => ipcRenderer.send('open_in_browser', [url]),
    fatalError: (error, errorInfo) => ipcRenderer.send('fatal_error', [error, errorInfo]),
    runtimeVersions: () => ipcRenderer.invoke('runtime_versions', []),
    getOptions: () => ipcRenderer.invoke('get_options', []),
    updateOptions: (options) => ipcRenderer.invoke('update_options', [options]),
});
