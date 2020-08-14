import * as React from 'react';
import { Title } from '../types/Title';
import { TitlePackage } from './TitlePackage';

export interface TitleResultProps {
    title: Title;
}
interface TitleResultState {}
export class TitleResult extends React.Component<TitleResultProps, TitleResultState> {
    constructor(props: TitleResultProps) {
        super(props);
        this.state = {};
    }

    render(): JSX.Element {
        return (
            <div>
                <strong>{ this.props.title.name }</strong>
                <hr/>
                <div className="package-list">
                    {
                        this.props.title.packages.map((pkg, idx) => {
                            return (<TitlePackage package={pkg} key={idx} />);
                        })
                    }
                </div>
            </div>
        );
    }
}
