import React, { FC, ReactNode } from 'react';

import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { ProcessInstanceStatus, isProcessInstanceFinished } from 'runbotics-common';

import { Wrapper, LabelGroup } from './Label.styles';

export type Color = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
interface LabelProps {
    className?: string;
    color?: Color;
    children?: ReactNode;
    warning?: boolean
}

const isWarningDisplayed = (warning: boolean, children: ReactNode) : boolean => warning  && isProcessInstanceFinished(ProcessInstanceStatus[children as ProcessInstanceStatus]) && children as string in ProcessInstanceStatus;

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
        {isWarningDisplayed(warning, children)?
            <WarningAmberRoundedIcon color="warning" data-testid="WarningAmberRoundedIcon" /> : ''}
    </LabelGroup>
);

export default Label;
