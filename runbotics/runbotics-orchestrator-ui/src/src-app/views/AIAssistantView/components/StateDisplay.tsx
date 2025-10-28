import React from 'react';

import { StateContainer, StateIconBox, StateTitle, StateDescription, StateButton } from './StateDisplay.styles';

interface StateDisplayProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    variant?: 'info' | 'error';
}

export const StateDisplay: React.FC<StateDisplayProps> = ({ 
    icon,
    title, 
    description, 
    action,
    variant = 'info'
}) => (
    <StateContainer>
        <StateIconBox variant={variant}>
            {React.cloneElement(icon as React.ReactElement, {
                sx: {
                    fontSize: 40,
                    color: variant === 'error' ? 'error.dark' : 'grey.500',
                }
            })}
        </StateIconBox>
        
        <StateTitle variant="h5" color="textPrimary">
            {title}
        </StateTitle>
        
        <StateDescription 
            variant="body1" 
            color="textSecondary"
            stateVariant={variant}
        >
            {description}
        </StateDescription>

        {action && (
            <StateButton 
                variant="contained" 
                onClick={action.onClick}
            >
                {action.label}
            </StateButton>
        )}
    </StateContainer>
);
