export interface Options {
    CheckForUpdates: boolean;
    AskForDownloadLocation: boolean;
}

export const GetDefaultOptions = (): Options => {
    return {
        CheckForUpdates: true,
        AskForDownloadLocation: true,
    };
};
