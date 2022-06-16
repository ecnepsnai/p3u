import * as React from 'react';
import { IPC } from '../services/IPC';
import { Dialog } from './Dialog';
import { Options } from '../../shared/options';
import { Checkbox } from './Checkbox';

export const OptionsDialog: React.FC = () => {
    const [Loading, SetLoading] = React.useState(true);
    const [Options, SetOptions] = React.useState<Options>();

    React.useEffect(() => {
        IPC.getOptions().then(options => {
            SetOptions(options);
            SetLoading(false);
        });
    }, []);

    if (Loading) {
        return null;
    }

    const buttons = [
        {
            label: 'Save',
            onClick: () => {
                IPC.updateOptions(Options);
            }
        },
        {
            label: 'Cancel'
        }
    ];

    const SetCheckForUpdates = (CheckForUpdates: boolean) => {
        SetOptions(options => {
            options.CheckForUpdates = CheckForUpdates;
            return {...options};
        });
    };

    const SetAskForDownloadLocation = (AskForDownloadLocation: boolean) => {
        SetOptions(options => {
            options.AskForDownloadLocation = AskForDownloadLocation;
            return {...options};
        });
    };

    return (
        <Dialog title="Options" buttons={buttons}>
            <Checkbox defaultChecked={Options.CheckForUpdates} onChange={SetCheckForUpdates} label="Check for updates" />
            <Checkbox defaultChecked={Options.AskForDownloadLocation} onChange={SetAskForDownloadLocation} label="Ask for download location each time" />
        </Dialog>
    );
};
