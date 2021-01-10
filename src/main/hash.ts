import fs = require('fs');
import crypto = require('crypto');

export class Hash {
    public static async file(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const options = fs.statSync(filePath);
            const max = options.size - 0x20;

            const hash = crypto.createHash('sha1');
            hash.setEncoding('hex');
            const stream = fs.createReadStream(filePath);

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