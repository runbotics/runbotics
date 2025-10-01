import React from 'react';

import SearchOffIcon from '@mui/icons-material/SearchOff';

import { StateDisplay } from './StateDisplay';

interface EmptyStateProps {
    title: string;
    description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => (
    <StateDisplay
        icon={<SearchOffIcon />}
        title={title}
        description={description}
        variant="info"
    />
);
