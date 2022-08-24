import React, { FC, ReactNode } from 'react';
import { Wrapper } from './Label.styles';

export type Color = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

interface LabelProps {
    className?: string;
    color?: Color;
    children?: ReactNode;
}

const Label: FC<LabelProps> = ({
    color = 'secondary', children, ...rest
}) => (
        <Wrapper
            color={color}
            {...rest}
        >
            {children}
        </Wrapper>
);

export default Label;
