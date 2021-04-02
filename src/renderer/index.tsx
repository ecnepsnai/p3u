import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import { AboutModal } from './AboutModal';
import { IPC } from './services/IPC';

IPC.getTitle().then(title => {
    if (title === 'PlayStation 3 Updater') {
        ReactDOM.render(
            <App />,
            document.getElementById('app')
        );
    } else if (title === 'About') {
        ReactDOM.render(
            <AboutModal />,
            document.getElementById('app')
        );
    } else {
        alert('Unknown window title ' + title);
    }
});
