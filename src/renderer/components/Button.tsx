import * as React from 'react';
import '../../../css/Button.scss';

export interface ButtonProps {
    onClick: () => (void);
    disabled?: boolean;
}
export class Button extends React.Component<ButtonProps, unknown> {
    render(): JSX.Element {
        return (
            <button type="button" className="btn" onClick={this.props.onClick} disabled={this.props.disabled}>
                {this.props.children}
            </button>
        );
    }
}
