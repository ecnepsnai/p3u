import fs = require('fs');
import crypto = require('crypto');

export class Security {
    /**
     * Generate a SHA-1 hash of the specified package file
     * **NOTE**: The PlayStation API specifies that only lengh-32
     * be hashed, as the last 32B are the hash itself (for redundancy?).
     * This method only hashes all but the last 32B of the given file.
     * @param path The file path for the package
     */
    public static hashPackage(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const options = fs.statSync(path);
            const max = options.size - 0x20;

            const hash = crypto.createHash('sha1');
            hash.setEncoding('hex');
            const stream = fs.createReadStream(path);

            let length = 0;
            stream.on('readable', () => {
                let chunk;
                while (length < max) {
                    const readL = Math.min(65536, max-length);
                    chunk = stream.read(readL);
                    if (!chunk) {
                        break;
                    }
                    length += chunk.length;
                    hash.write(chunk);
                }

                if (length == max) {
                    hash.end();
                    stream.close();
                    resolve(hash.read());
                    return;
                }
            });
            stream.on('error', e => {
                reject(e);
            });
        });
    }
}
