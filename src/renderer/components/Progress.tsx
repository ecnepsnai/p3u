import * as React from 'react';
import '../../../css/Progress.scss';

export interface ProgressProps {
    value: number;
    max?: number;
}
export class Progress extends React.Component<ProgressProps, unknown> {
    render(): JSX.Element {
        return (
            <progress max={this.props.max||100} value={this.props.value} />
        );
    }
}
