import * as React from 'react';
import { Title, Package } from '../types/Title';
import { TitlePackage } from './TitlePackage';
import '../../../css/TitleResult.scss';
import { Icon } from './Icon';
import { Notify } from '../services/Notify';
import { Button } from './Button';
import { IPC } from '../services/IPC';

export interface TitleResultProps {
    title: Title;
}
interface TitleResultState {
    isDownloading?: boolean;
    downloadToDir?: string;
    finished?: boolean;
}
export class TitleResult extends React.Component<TitleResultProps, TitleResultState> {
    constructor(props: TitleResultProps) {
        super(props);
        this.state = {};
        this.props.title.packages.forEach(pkg => {
            this.packageDownloaded[pkg.version] = false;
        });
    }
    private packageDownloaded: {[id: string]: boolean} = {};

    private downloadAll = () => {
        IPC.saveMultiplePackages().then(results => {
            if (results.canceled) {
                return;
            }

            this.setState({ isDownloading: true, downloadToDir: results.filePaths[0] });
        }, e => {
            console.error(e);
            IPC.errorDialog('Error Downloading Packages', 'An error occurred while downloading the update package. Please try again later.', JSON.stringify(e));
        });
    }

    private onDownloadFinished = (pkg: Package) => {
        this.packageDownloaded[pkg.version] = true;
        console.log(this.packageDownloaded);
        this.checkAllFinished();
    }

    private checkAllFinished = () => {
        let allDone = true;
        Object.keys(this.packageDownloaded).forEach(ver => {
            if (!this.packageDownloaded[ver]) {
                allDone = false;
            }
        });
        if (allDone) {
            this.setState({ isDownloading: false, downloadToDir: undefined, finished: true });
            Notify.Now();
        }
    }

    render(): JSX.Element {
        return (
            <div className="title-result">
                <div className="title-title">
                    <h2>{ this.props.title.name }</h2>
                    <Button onClick={this.downloadAll} disabled={this.state.isDownloading||this.state.finished}>
                        <Icon.Label icon={<Icon.Download/>} label="Download All" />
                    </Button>
                </div>
                <div className="package-list">
                    {
                        this.props.title.packages.map(pkg => {
                            return (<TitlePackage package={pkg} key={Math.random()} downloadToDir={this.state.downloadToDir} onDownloadFinished={this.onDownloadFinished} isDownloaded={this.state.finished}/>);
                        })
                    }
                </div>
            </div>
        );
    }
}
