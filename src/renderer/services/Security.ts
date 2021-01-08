import { IPC } from "./IPC";

export class Security {
    /**
     * Generate a SHA-1 hash of the specified package file
     * **NOTE**: The PlayStation API specifies that only length-32
     * be hashed, as the last 32B are the hash itself (for redundancy?).
     * This method only hashes all but the last 32B of the given file.
     * @param path The file path for the package
     */
    public static hashPackage(path: string): Promise<string> {
        return IPC.hashFile(path);
    }
}
