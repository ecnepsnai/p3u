export class Path {
    public static join(...parts: string[]): string {
        let sep = '/';
        if (((window as any).osPlatform as string) === 'win32') {
            sep = '\\';
        }
        return parts.join(sep);
    }
}