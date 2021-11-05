import * as React from 'react';
import { Title } from './types/Title';
import { TitleInput } from './components/TitleInput';
import { TitleResult } from './components/TitleResult';
import { API } from './services/API';
import { IPC } from './services/IPC';
import { Icon } from './components/Icon';
import { Link } from './components/Link';
import '../../css/App.scss';

export const App: React.FC = () => {
    const [Loading, SetLoading] = React.useState<boolean>(true);
    const [TitleLoading, SetTitleLoading] = React.useState<boolean>();
    const [TitleError, SetTitleError] = React.useState<string>();
    const [Title, SetTitle] = React.useState<Title>();
    const [NewVersionURL, SetNewVersionURL] = React.useState<string>();

    React.useEffect(() => {
        API.Test().then(() => {
            SetLoading(false);
        });

        IPC.checkForUpdates().then(newURL => {
            SetNewVersionURL(newURL);
        });
    }, []);

    const lookupTitle = (titleID: string) => {
        SetTitleLoading(true);
        SetTitle(undefined);

        API.LookupTitle(titleID).then(title => {
            SetTitle(title);
            SetTitleError(undefined);
            SetTitleLoading(false);
        }, () => {
            SetTitleError('Unknown title ID or no updates available for this title');
            SetTitleLoading(false);
        });
    };

    const titleError = () => {
        if (!TitleError) {
            return null;
        }

        return (
            <div className="title-error">
                <Icon.Label icon={<Icon.TimesCircle />} label={TitleError} />
            </div>
        );
    };

    const results = () => {
        if (!Title) {
            return null;
        }

        return (
            <TitleResult title={Title} />
        );
    };

    const newVersionBanner = () => {
        if (!NewVersionURL) {
            return null;
        }

        return (<div className="new-version">
            <strong>A newer version is available</strong>
            <Link url={NewVersionURL}>Click here to view</Link>
        </div>);
    };

    if (Loading) {
        return (<div>Loading...</div>);
    }

    return (
        <div>
            {newVersionBanner()}
            <TitleInput onSubmit={lookupTitle} loading={TitleLoading} />
            {titleError()}
            {results()}
        </div>
    );
};
