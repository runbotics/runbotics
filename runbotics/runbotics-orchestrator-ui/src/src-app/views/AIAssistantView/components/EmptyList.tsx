import React from 'react';

import SearchOffIcon from '@mui/icons-material/SearchOff';

import { StateDisplay } from './StateDisplay';

interface EmptyListProps {
    title: string;
    description: string;
}

export const EmptyList: React.FC<EmptyListProps> = ({ title, description }) => (
    <StateDisplay
        icon={<SearchOffIcon />}
        title={title}
        description={description}
        variant="info"
    />
);
