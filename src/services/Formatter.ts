export class Formatter {
    private static round(value: number, decimals: number): number {
        return Number(Math.round(parseFloat(value+'e'+decimals))+'e-'+decimals);
    }

    private static bytes(input: number, k: number): string {
        const KB = k;
        const MB = k * k;
        const GB = k * k * k;
        const TB = k * k * k * k;

        if (input == undefined) {
            console.warn('undefined input specified');
            return;
        }

        if (input > TB) {
            return this.round(input / TB, 2) + ' TiB';
        } else if (input == TB) {
            return '1 TiB';
        } else if (input > GB) {
            return this.round(input / GB, 2) + ' GiB';
        } else if (input == GB) {
            return '1 GiB';
        } else if (input > MB) {
            return this.round(input / MB, 2) + ' MiB';
        } else if (input == MB) {
            return '1 MiB';
        } else if (input > KB) {
            return this.round(input / KB, 2) + ' KiB';
        } else if (input == KB) {
            return '1 KiB';
        }

        return input + ' B';
    }

    public static BytesDecimal(input: number): string {
        return this.bytes(input, 1000);
    }

    public static BytesBinary(input: number): string {
        return this.bytes(input, 1024);
    }
}