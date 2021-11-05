import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
    faCheckCircle,
    faDownload,
    faInfoCircle,
    faSearch,
    faSpinner,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

export namespace Icon {
    interface IconProps {
        pulse?: boolean;
        spin?: boolean;
        title?: string;
    }

    interface EIconProps {
        icon: IconProp;
        options: IconProps;
    }

    export const EIcon: React.FC<EIconProps> = (props: EIconProps) => {
        return (<FontAwesomeIcon icon={props.icon} pulse={props.options.pulse} spin={props.options.spin} title={props.options.title} />);
    };

    interface LabelProps { icon: JSX.Element; spin?: boolean; label: string | number; }
    export const Label: React.FC<LabelProps> = (props: LabelProps) => {
        return (
            <span>
                {props.icon}
                <span className="ml-1">{props.label}</span>
            </span>
        );
    };

    export const CheckCircle: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faCheckCircle, options: props });
    export const Download: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faDownload, options: props });
    export const InfoCircle: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faInfoCircle, options: props });
    export const Search: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faSearch, options: props });
    export const Spinner: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faSpinner, options: props });
    export const TimesCircle: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faTimesCircle, options: props });
}
