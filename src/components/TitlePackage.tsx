import * as React from 'react';
import { Package } from '../types/Title';
import { Downloader } from '../services/Downloader';
import { Formatter } from '../services/Formatter';
import { Icon } from './Icon';
import '../../css/TitlePackage.scss';
import { Dialog } from '../services/Dialog';
import path = require('path');
import { Notify } from '../services/Notify';

export interface TitlePackageProps {
    package: Package;
    downloadToDir?: string;
    isDownloaded?: boolean;
    onDownloadFinished: (pkg: Package) => (void);
}
interface TitlePackageState {
    isDownloading: boolean;
    downloadDir?: string;
    finished?: boolean;
    percent: number;
}
export class TitlePackage extends React.Component<TitlePackageProps, TitlePackageState> {
    constructor(props: TitlePackageProps) {
        super(props);
        this.state = {
            isDownloading: props.downloadToDir != undefined,
            downloadDir: props.downloadToDir,
            finished: props.isDownloaded,
            percent: 0,
        };
    }

    componentDidMount(): void {
        if (this.state.isDownloading && this.state.downloadDir) {
            this.startDownload(path.join(this.state.downloadDir, this.packageName()));
        }
    }

    private buttonClick = () => {
        if (this.state.isDownloading || this.state.finished) {
            return;
        }

        const filePath = Dialog.SavePackage(this.packageName());
        if (!filePath) {
            return;
        }

        this.startDownload(filePath).then(success => {
            if (success) {
                Notify.Now();
            }
        });
    }

    private startDownload(downloadPath: string): Promise<boolean> {
        this.setState({ isDownloading: true });
        return Downloader.DownloadPackage(this.props.package, downloadPath, (percent: number) => {
            this.setState({ percent: percent });
        }).then(success => {
            this.setState({ isDownloading: false, percent: 0, finished: success, downloadDir: undefined });
            this.props.onDownloadFinished(this.props.package);
            return success;
        });
    }

    private packageName = (): string => {
        const parts = this.props.package.url.split('/');
        const name = parts[parts.length-1];
        return name;
    }

    private button = () => {
        let content = (
            <Icon.Label icon={<Icon.Download/>} label="Download" />
        );
        if (this.state.isDownloading) {
            content = (
                <progress max="100" value={this.state.percent}> {this.state.percent}% </progress>
            );
        } else if (this.state.finished) {
            content = (
                <Icon.Label icon={<Icon.CheckCircle/>} label="Downloaded" />
            );
        }

        let className = 'package-button';
        if (this.state.isDownloading) {
            className += ' button-disabled';
        } else if (this.state.finished) {
            className += ' button-success';
        } else {
            className += ' button-download';
        }

        return (
            <div className={className} onClick={this.buttonClick}>
                { content }
            </div>
        );
    }

    render(): JSX.Element {
        return (
            <div className="package">
                <div className="info">
                    <span className="property"><span className="label">Version: </span><span className="value">{ this.props.package.version }</span></span>
                    <span className="property"><span className="label">Size: </span><span className="value">{ Formatter.BytesDecimal(this.props.package.size) }</span></span>
                </div>
                <div className="controls">
                    { this.button() }
                </div>
            </div>
        );
    }
}
