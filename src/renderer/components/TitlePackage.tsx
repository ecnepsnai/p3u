import * as React from 'react';
import { Package } from '../types/Title';
import { Downloader } from '../services/Downloader';
import { Formatter } from '../services/Formatter';
import { Icon } from './Icon';
import { Notify } from '../services/Notify';
import { Button } from './Button';
import { Progress } from './Progress';
import { Path } from '../services/Path';
import { IPC } from '../services/IPC';
import '../../../css/TitlePackage.scss';

export interface TitlePackageProps {
    package: Package;
    downloadToDir?: string;
    isDownloaded?: boolean;
    onDownloadFinished: (pkg: Package) => (void);
}
export const TitlePackage: React.FC<TitlePackageProps> = (props: TitlePackageProps) => {
    const [IsDownloading, SetIsDownloading] = React.useState(props.downloadToDir != undefined);
    const [DownloadDir, SetDownloadDir] = React.useState(props.downloadToDir);
    const [Finished, SetFinished] = React.useState(props.isDownloaded);
    const [DownloadPercent, SetDownloadPercent] = React.useState(0);

    React.useEffect(() => {
        if (IsDownloading && DownloadDir) {
            startDownload(Path.join(DownloadDir, packageName()));
        }
    }, []);

    const buttonClick = () => {
        if (IsDownloading || Finished) {
            return;
        }

        IPC.saveSinglePackage(packageName()).then(result => {
            if (!result) {
                return;
            }

            startDownload(result).then(success => {
                if (success) {
                    Notify.Now();
                }
            }, e => {
                console.error('Error downloading package', e);
                IPC.errorDialog('Error Downloading Package', 'An error occurred while downloading the update package. Please try again later.', JSON.stringify(e));
            });
        });
    };

    const startDownload = async (downloadPath: string): Promise<boolean> => {
        SetIsDownloading(true);
        const success = await Downloader.DownloadPackage(props.package, downloadPath, (percent: number) => {
            SetDownloadPercent(percent);
        });
        SetIsDownloading(false);
        SetDownloadPercent(0);
        SetFinished(success);
        SetDownloadDir(undefined);
        props.onDownloadFinished(props.package);
        return success;
    };

    const packageName = (): string => {
        const parts = props.package.url.split('/');
        const name = parts[parts.length-1];
        return name;
    };

    const button = () => {
        let content = (
            <Icon.Label icon={<Icon.Download/>} label="Download" />
        );
        if (IsDownloading) {
            content = (
                <Progress value={DownloadPercent} />
            );
        } else if (Finished) {
            content = (
                <Icon.Label icon={<Icon.CheckCircle/>} label="Downloaded" />
            );
        }

        return (
            <Button onClick={buttonClick} disabled={IsDownloading||Finished}>
                {content}
            </Button>
        );
    };

    return (
        <div className="package">
            <div className="info">
                <span className="property"><span className="label">Version: </span><span className="value">{ props.package.version }</span></span>
                <span className="property"><span className="label">Size: </span><span className="value">{ Formatter.BytesDecimal(props.package.size) }</span></span>
            </div>
            <div className="controls">
                { button() }
            </div>
        </div>
    );
};
