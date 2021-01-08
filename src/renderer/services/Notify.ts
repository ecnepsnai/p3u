import { IPC } from "./IPC";

export class Notify {
    public static Now(): void {
        IPC.alert();
    }
}