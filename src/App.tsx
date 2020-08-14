import * as React from 'react';
import { Title } from './types/Title';
import { TitleInput } from './components/TitleInput';
import { TitleResult } from './components/TitleResult';
import { API } from './services/API';

export interface AppProps {}
interface AppState {
    loading?: boolean;
    titleError?: string;
    title?: Title;
}
export class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {};
    }

    private lookupTitle = (titleID: string) => {
        this.setState({ loading: true, title: undefined });

        API.LookupTitle(titleID).then(title => {
            this.setState({ loading: false, title: title });
        });
    }

    private results = () => {
        if (!this.state.title) { return null; }

        return (
            <TitleResult title={this.state.title} />
        );
    }

    render(): JSX.Element {
        return (
            <div>
                <TitleInput onSubmit={this.lookupTitle} disabled={this.state.loading} />
                { this.results() }
            </div>
        );
    }
}
