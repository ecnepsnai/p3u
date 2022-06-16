import * as React from 'react';
import { RuntimeVersions } from '../types/RuntimeVersions';
import { IPC } from '../services/IPC';
import { Link } from './Link';
import { Dialog } from './Dialog';
import '../../../css/About.scss';

export const AboutDialog: React.FC = () => {
    const [Loading, setLoading] = React.useState(true);
    const [Versions, setVersions] = React.useState<RuntimeVersions>();

    React.useEffect(() => {
        IPC.runtimeVersions().then(versions => {
            setVersions(versions);
            setLoading(false);
        });
    }, []);

    const versionContent = () => {
        if (Loading) {
            return null;
        }

        return (
            <p>
                Application: <strong>{Versions.app}</strong><br/>
                Electron: <strong>{Versions.electron}</strong><br/>
                Node.js: <strong>{Versions.nodejs}</strong><br/>
            </p>
        );
    };

    return (
        <Dialog title="About PlayStation 3 Updater" buttons={[{label: 'Dismiss'}]}>
            <div className="about">
                <div className="image">
                    <img src="assets/P3U.png" alt="PlayStation 3 Updater" />
                </div>
                <div className="contents">
                    <h1>PlayStation 3 Updater</h1>
                    <p>Copyright &copy; <Link url="https://ianspence.com">Ian Spence</Link> 2021-2022. Released under the <Link url="https://opensource.org/licenses/ISC">ISC license</Link>. Source code available at <Link url="https://github.com/ecnepsnai/p3u">github.com/ecnepsnai/p3u</Link>.</p>
                    {versionContent()}
                    <p>
                        The &quot;PlayStation logo&quot;, &quot;PlayStation 3 logo&quot;, &quot;PlayStation 4 logo&quot;, &quot;PlayStation Portable logo&quot;, &quot;PlayStation Vita logo&quot;, &quot;PlayStation Move logo&quot;, &quot;PlayStation Network logo&quot;, &quot;PlayStation Store logo&quot;, &quot;PlayStation Plus logo&quot;, &quot;Sony logo&quot;, &quot;Sony Computer Entertainment logo&quot; and their aforementioned names are registered trademarks of Sony Computer Entertainment Inc. &quot;Sony Entertainment Network&quot; is a trademark of Sony Corporation. Library programs are copyright Sony Interactive Entertainment Inc.
                    </p>
                </div>
            </div>
        </Dialog>
    );
};
