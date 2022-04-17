import { app } from 'electron';
import * as manifest from '../../package.json';
import path = require('path');
import fs = require('fs');
import { Options, GetDefaultOptions } from '../shared/options';

export class OptionsManager {
    private static currentOptions: Options;

    public static Initialize = () => {
        const configDir = path.join(app.getPath('appData'), manifest.name);
        const configPath = path.join(configDir, 'config.json');

        try {
            fs.existsSync(configDir);
            console.log('[CONFIG] config directory exists');
        } catch {
            console.warn('[CONFIG] config directory does not exist');
            fs.mkdirSync(configDir);
            console.log('[CONFIG] config directory created');
        }

        try {
            fs.accessSync(configPath);
            const current = JSON.parse(fs.readFileSync(configPath).toString()) as Options;
            OptionsManager.currentOptions = current;
            console.log('[CONFIG] read options');
        } catch {
            console.warn('[CONFIG] config path does not exist');
            OptionsManager.currentOptions = GetDefaultOptions();
            console.log('[CONFIG] initialized default options');
        }
        console.log('[CONFIG] options loaded', OptionsManager.currentOptions);
    };

    public static Get = (): Options => {
        return this.currentOptions;
    };

    public static Set = async (newValue: Options): Promise<void> => {
        const deleteFile = (p: string) => {
            return new Promise<void>((resolve, reject) => {
                fs.unlink(p, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        const writeFile = (p: string, d: string) => {
            return new Promise<void>((resolve, reject) => {
                fs.writeFile(p, d, {
                    flag: 'w+'
                }, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };


        const configPath = path.join(app.getPath('appData'), manifest.name, 'config.json');
        try {
            await deleteFile(configPath);
        } catch {
            // don't worry about it
        }
        try {
            await writeFile(configPath, JSON.stringify(newValue));
        } catch (err) {
            console.error('[CONFIG] error writing config file', err);
            throw err;
        }
        OptionsManager.currentOptions = newValue;
        console.log('[CONFIG] updated options', newValue);
    };
}