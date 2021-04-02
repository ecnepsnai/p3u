import * as React from 'react';
import { Title } from './types/Title';
import { TitleInput } from './components/TitleInput';
import { TitleResult } from './components/TitleResult';
import { API } from './services/API';
import { IPC } from './services/IPC';
import { Icon } from './components/Icon';
import { Link } from './components/Link';
import '../../css/App.scss';

interface AppState {
    loading: boolean;
    titleLoading?: boolean;
    titleError?: string;
    title?: Title;
    newVersionURL?: string;
}
export class App extends React.Component<unknown, AppState> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    componentDidMount(): void {
        API.Test().then(() => {
            this.setState({
                loading: false,
            });
        });

        IPC.checkForUpdates().then(newURL => {
            this.setState({ newVersionURL: newURL });
        });
    }

    private lookupTitle = (titleID: string) => {
        this.setState({ titleLoading: true, title: undefined });

        API.LookupTitle(titleID).then(title => {
            this.setState({ titleLoading: false, title: title, titleError: undefined });
        }, () => {
            this.setState({ titleLoading: false, titleError: 'Unknown title ID or no updates available for this title' });
        });
    }

    private titleError = () => {
        if (!this.state.titleError) {
            return null;
        }

        return (
            <div className="title-error">
                <Icon.Label icon={<Icon.TimesCircle />} label={this.state.titleError} />
            </div>
        );
    }

    private results = () => {
        if (!this.state.title) {
            return null;
        }

        return (
            <TitleResult title={this.state.title} />
        );
    }

    private newVersionBanner = () => {
        if (!this.state.newVersionURL) {
            return null;
        }

        return (<div className="new-version">
            <strong>A newer version is available</strong>
            <Link url={this.state.newVersionURL}>Click here to view</Link>
        </div>);
    }

    render(): JSX.Element {
        if (this.state.loading) {
            return (<div>Loading...</div>);
        }

        return (
            <div>
                { this.newVersionBanner() }
                <TitleInput onSubmit={this.lookupTitle} loading={this.state.titleLoading} />
                { this.titleError() }
                { this.results() }
            </div>
        );
    }
}
