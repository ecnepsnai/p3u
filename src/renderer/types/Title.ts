export interface Package {
    version: string;
    size: number;
    sha1_sum: string;
    url: string;
}

export interface Title {
    title_id: string;
    name: string;
    packages: Package[];
}