import React, { FC, ReactNode } from 'react';

import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { ProcessInstanceStatus, isProcessInstanceFinished } from 'runbotics-common';

import { Wrapper, LabelGroup } from './Label.styles';



export type Color = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

interface LabelProps {
    className?: string;
    color?: Color;
    children?: ReactNode;
    warning?:boolean
}

const Label: FC<LabelProps> = ({
    color = 'secondary', children, warning = false, ...rest
}) => (
    <LabelGroup>
        <Wrapper
            color={color}
            {...rest}
        >
            {children}
        </Wrapper>
        {warning && isProcessInstanceFinished(ProcessInstanceStatus[children.toString()])?
            <WarningAmberRoundedIcon color="warning"/> : ''}
    </LabelGroup>
);

export default Label;
