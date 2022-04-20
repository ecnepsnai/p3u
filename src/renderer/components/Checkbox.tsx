import * as React from 'react';
import '../../../css/Checkbox.scss';

export interface CheckboxProps {
    label: string;
    defaultChecked: boolean;
    onChange: (checked: boolean) => void;
}
export const Checkbox: React.FC<CheckboxProps> = (props: CheckboxProps) => {
    const [Checked, SetChecked] = React.useState(props.defaultChecked);
    const [id] = React.useState(Math.floor(Math.random() * 100)+'_checkbox');

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        SetChecked(target.checked);
    };

    React.useEffect(() => {
        if (Checked === undefined) {
            return;
        }

        props.onChange(Checked);
    }, [Checked]);

    return (
        <label htmlFor={id} className="input-checkbox">
            <input type="checkbox" id={id} name={id} defaultChecked={Checked} onChange={onChange} />
            <span>{ props.label }</span>
        </label>
    );
};
