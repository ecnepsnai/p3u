import * as React from 'react';
import '../../../css/TitleInput.scss';
import { Icon } from './Icon';

export interface TitleInputProps {
    onSubmit: (titleID: string) => void;
    loading: boolean;
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

    private icon = () => {
        if (!this.props.loading) {
            return null; 
        }
        return (
            <div className="search-box-icon">
                <Icon.Spinner pulse />
            </div>
        );
    }

    render(): JSX.Element {
        return (
            <div className="title-id-input">
                <form onSubmit={this.formSubmit}>
                    <label>Game ID <small>Can be found on the side of any game package at the bottom</small></label>
                    <div className="search-box">
                        <div className="search-box-icon">
                            <Icon.Search />
                        </div>
                        <input type="text" placeholder="Example: BCUS98114" onChange={this.titleIDChange} required disabled={this.props.loading}/>
                        { this.icon() }
                    </div>
                </form>
            </div>
        );
    }
}
