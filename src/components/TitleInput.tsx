import * as React from 'react';

export interface TitleInputProps {
    onSubmit: (titleID: string) => void;
    disabled: boolean;
}
interface TitleInputState {
    titleID?: string;
}
export class TitleInput extends React.Component<TitleInputProps, TitleInputState> {
    constructor(props: TitleInputProps) {
        super(props);
        this.state = {};
    }

    private titleIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        this.setState({ titleID: target.value });
    }

    private formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.onSubmit(this.state.titleID);
    }

    render(): JSX.Element {
        return (
            <div className="title-id-input">
                <form onSubmit={this.formSubmit}>
                    <label>Title ID</label>
                    <input type="text" placeholder="BCUS98114" onChange={this.titleIDChange} required disabled={this.props.disabled}/>
                    <button type="submit" disabled={this.props.disabled}>Lookup</button>
                </form>
            </div>
        );
    }
}
