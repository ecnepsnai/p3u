import * as React from 'react';
import '../../../css/Progress.scss';

export interface ProgressProps {
    value: number;
    max?: number;
}
export const Progress: React.FC<ProgressProps> = (props: ProgressProps) => {
    return (
        <progress max={props.max || 100} value={props.value} />
    );
};
