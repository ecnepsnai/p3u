import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './App';
import { AboutModal } from './AboutModal';
import { OptionsModal } from './OptionsModal';
import { IPC } from './services/IPC';

IPC.getTitle().then(title => {
    if (title === 'PlayStation 3 Updater') {
        ReactDOM.createRoot(document.getElementById('app')).render(<App />);
    } else if (title === 'About') {
        ReactDOM.createRoot(document.getElementById('app')).render(<AboutModal />);
    } else if (title === 'Options') {
        ReactDOM.createRoot(document.getElementById('app')).render(<OptionsModal />);
    } else {
        alert('Unknown window title ' + title);
    }
});
