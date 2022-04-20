import * as React from 'react';
import { IPC } from './services/IPC';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Options } from '../shared/options';
import { Checkbox } from './components/Checkbox';
import '../../css/App.scss';
import '../../css/Options.scss';

export const OptionsModal: React.FC = () => {
    const [IsLoading, SetIsLoading] = React.useState(true);
    const [Config, SetConfig] = React.useState<Options>();

    React.useEffect(() => {
        if (Config === undefined) {
            return;
        }

        IPC.updateOptions(Config).then(() => {
            console.log('Saved!');
        }, err => {
            console.error(err);
        });
    }, [Config]);

    React.useEffect(() => {
        IPC.getOptions().then(options => {
            SetConfig(options);
            SetIsLoading(false);
        });
    }, []);

    if (IsLoading) {
        return (<div></div>);
    }

    const SetCheckForUpdates = (CheckForUpdates: boolean) => {
        console.log('CheckForUpdates', CheckForUpdates);
        SetConfig(config => {
            config.CheckForUpdates = CheckForUpdates;
            return {...config};
        });
    };

    const SetAskForDownloadLocation = (AskForDownloadLocation: boolean) => {
        console.log('AskForDownloadLocation', AskForDownloadLocation);
        SetConfig(config => {
            config.AskForDownloadLocation = AskForDownloadLocation;
            return {...config};
        });
    };

    return (<ErrorBoundary>
        <div className="modal options">
            <form>
                <Checkbox defaultChecked={Config.CheckForUpdates} onChange={SetCheckForUpdates} label="Check for updates" />
                <Checkbox defaultChecked={Config.AskForDownloadLocation} onChange={SetAskForDownloadLocation} label="Ask for download location each time" />
            </form>
        </div>
    </ErrorBoundary>);
};
