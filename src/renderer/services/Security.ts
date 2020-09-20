const ipcRenderer = (window as any).ipcRenderer as Electron.IpcRenderer;

export class Security {
    /**
     * Generate a SHA-1 hash of the specified package file
     * **NOTE**: The PlayStation API specifies that only lengh-32
     * be hashed, as the last 32B are the hash itself (for redundancy?).
     * This method only hashes all but the last 32B of the given file.
     * @param path The file path for the package
     */
    public static hashPackage(path: string): Promise<string> {
        return ipcRenderer.invoke('hash_file', [path]).then(result => {
            return result as string;
        });
    }
}
