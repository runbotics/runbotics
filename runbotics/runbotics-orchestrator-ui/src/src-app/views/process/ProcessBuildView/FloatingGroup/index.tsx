import React, { FC } from 'react';

import { StyledFloatingGroup } from './FloatingGroup.styled';

export interface FloatingGroupProps {
    children: React.ReactNode;
    verticalPosition: 'top' | 'bottom';
    horizontalPosition: 'left' | 'right';
    withSeparator?: boolean;
}

const FloatingGroup: FC<FloatingGroupProps> = ({
    children,
    verticalPosition,
    horizontalPosition,
    withSeparator,
}) => (
    <StyledFloatingGroup
        horizontalPosition={horizontalPosition}
        verticalPosition={verticalPosition}
        withSeparator={withSeparator}
    >
        {children}
    </StyledFloatingGroup>
);

export default FloatingGroup;
