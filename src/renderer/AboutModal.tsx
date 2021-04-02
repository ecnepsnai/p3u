import * as React from 'react';
import { RuntimeVersions } from './types/Versions';
import { IPC } from './services/IPC';
import { Link } from './components/Link';
import { ErrorBoundary } from './components/ErrorBoundary';
import '../../css/App.scss';
import '../../css/About.scss';

export const AboutModal: React.FC = () => {
    const [Loading, setLoading] = React.useState(true);
    const [Versions, setVersions] = React.useState<RuntimeVersions>();

    React.useEffect(() => {
        IPC.runtimeVersions().then(versions => {
            setVersions(versions);
            setLoading(false);
        });
    }, []);

    if (Loading) {
        return null;
    }

    return (<ErrorBoundary>
        <div className="modal about">
            <div className="image">
                <img src="icons/P3U.png" alt="PlayStation 3 Updater" />
            </div>
            <div className="contents">
                <h1>PlayStation 3 Updater</h1>
                <p>Copyright &copy; <Link url="https://ianspence.com">Ian Spence</Link> 2021. Released under the <Link url="https://opensource.org/licenses/ISC">ISC license</Link>. Source code available at <Link url="https://github.com/ecnepsnai/p3u">github.com/ecnepsnai/p3u</Link>.</p>
                <p>
                    Application: <strong>{Versions.app}</strong><br/>
                    Electron: <strong>{Versions.electron}</strong><br/>
                    Node.js: <strong>{Versions.nodejs}</strong><br/>
                </p>
            </div>
        </div>
    </ErrorBoundary>);
};
