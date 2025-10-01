import React from 'react';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import useTranslations from '#src-app/hooks/useTranslations';

import { StateDisplay } from './StateDisplay';

interface ErrorStateProps {
    title: string;
    description: string;
    onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
    title, 
    description, 
    onRetry 
}) => {
    const { translate } = useTranslations();
    
    return (
        <StateDisplay
            icon={<ErrorOutlineIcon />}
            title={title}
            description={description}
            action={onRetry ? { label: translate('AIAssistant.Error.RetryButton'), onClick: onRetry } : undefined}
            variant="error"
        />
    );
};
