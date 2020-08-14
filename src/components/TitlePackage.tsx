import * as React from 'react';
import { Package } from '../types/Title';
import { Downloader } from '../services/Downloader';

export interface TitlePackageProps {
    package: Package;
    isDownloading?: boolean;
}
interface TitlePackageState {
    isDownloading: boolean;
    percent: number;
}
export class TitlePackage extends React.Component<TitlePackageProps, TitlePackageState> {
    constructor(props: TitlePackageProps) {
        super(props);
        this.state = {
            isDownloading: props.isDownloading,
            percent: 0,
        };
    }

    private downloadClick = () => {
        this.setState({ isDownloading: true });
        Downloader.DownloadPackage(this.props.package, (percent: number) => {
            this.setState({ percent: percent });
        }).then(success => {
            console.log(success);
            this.setState({ isDownloading: false, percent: 0 });
        });
    }

    private downloadButton = () => {
        const content = this.state.isDownloading ? 'Downloading...' : 'Download';
        return (
            <button disabled={this.state.isDownloading} onClick={this.downloadClick}>{content}</button>
        );
    }

    private progressBar = () => {
        if (!this.state.isDownloading) { return null; }

        return (
        <progress max="100" value={this.state.percent}> {this.state.percent}% </progress>
        );
    }

    render(): JSX.Element {
        return (
            <div className="package">
                <p>Version <strong>{ this.props.package.version }</strong></p>
                <p>Size <strong>{ this.props.package.size }</strong></p>
                { this.downloadButton() }
                { this.progressBar() }
            </div>
        );
    }
}
