import * as React from 'react';
import { Title, Package } from '../types/Title';
import { TitlePackage } from './TitlePackage';
import { Icon } from './Icon';
import { Notify } from '../services/Notify';
import { Button } from './Button';
import { IPC } from '../services/IPC';
import '../../../css/TitleResult.scss';

export interface TitleResultProps {
    title: Title;
}
export const TitleResult: React.FC<TitleResultProps> = (props: TitleResultProps) => {
    const [IsDownloading, SetIsDownloading] = React.useState<boolean>();
    const [DownloadDir, SetDownloadDir] = React.useState<string>();
    const [Finished, SetFinished] = React.useState<boolean>();
    const [PackagesDownloaded, SetPackagesDownloaded] = React.useState<{[id: string]: boolean}>({});

    React.useEffect(() => {
        SetPackagesDownloaded(dp => {
            props.title.packages.forEach(pkg => {
                dp[pkg.version] = false;
            });
            return dp;
        });
    }, []);

    const downloadAll = () => {
        IPC.saveMultiplePackages().then(result => {
            if (!result) {
                return;
            }

            SetIsDownloading(true);
            SetDownloadDir(result);
        }, e => {
            console.error(e);
            IPC.errorDialog('Error Downloading Packages', 'An error occurred while downloading the update package. Please try again later.', JSON.stringify(e));
        });
    };

    const onDownloadFinished = (pkg: Package) => {
        SetPackagesDownloaded(dp => {
            dp[pkg.version] = true;
            return dp;
        });
        checkAllFinished();
    };

    const checkAllFinished = () => {
        let allDone = true;
        Object.keys(PackagesDownloaded).forEach(ver => {
            if (!PackagesDownloaded[ver]) {
                allDone = false;
            }
        });
        if (allDone) {
            SetIsDownloading(false);
            SetDownloadDir(undefined);
            SetFinished(true);
            Notify.Now();
        }
    };

    return (
        <div className="title-result">
            <div className="title-title">
                <h2>{ props.title.name }</h2>
                <Button onClick={downloadAll} disabled={IsDownloading||Finished}>
                    <Icon.Label icon={<Icon.Download/>} label="Download All" />
                </Button>
            </div>
            <div className="package-list">
                {
                    props.title.packages.map(pkg => {
                        return (<TitlePackage package={pkg} key={Math.random()} downloadToDir={DownloadDir} onDownloadFinished={onDownloadFinished} isDownloaded={Finished}/>);
                    })
                }
            </div>
        </div>
    );
};
