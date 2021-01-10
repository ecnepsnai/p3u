export class Path {
    public static join(...parts: string[]): string {
        let sep = '/';
        const isWindows = navigator.platform.toLowerCase().includes('win32');
        if (isWindows) {
            sep = '\\';
        }
        return parts.join(sep);
    }
}