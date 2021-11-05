import * as React from 'react';
import { Icon } from './Icon';
import '../../../css/TitleInput.scss';

export interface TitleInputProps {
    onSubmit: (titleID: string) => void;
    loading: boolean;
}
export const TitleInput: React.FC<TitleInputProps> = (props: TitleInputProps) => {
    const [TitleID, SetTitleID] = React.useState<string>();

    const titleIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        SetTitleID(target.value);
    };

    const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onSubmit(TitleID);
    };

    const icon = () => {
        if (!props.loading) {
            return null; 
        }
        return (
            <div className="search-box-icon">
                <Icon.Spinner pulse />
            </div>
        );
    };

    return (
        <div className="title-id-input">
            <form onSubmit={formSubmit}>
                <label>Game ID <small>Can be found on the side of any game package at the bottom</small></label>
                <div className="search-box">
                    <div className="search-box-icon">
                        <Icon.Search />
                    </div>
                    <input type="text" placeholder="Example: BCUS98114" onChange={titleIDChange} required disabled={props.loading}/>
                    { icon() }
                </div>
            </form>
        </div>
    );
};
