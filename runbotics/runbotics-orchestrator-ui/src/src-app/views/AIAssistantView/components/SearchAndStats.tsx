import React from 'react';

import { TextField, Typography, Box } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { SearchContainer } from './SearchAndStats.styles';

interface SearchAndStatsProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    totalCount: number;
    searchLabel: string;
}

export const SearchAndStats: React.FC<SearchAndStatsProps> = ({
    searchQuery,
    onSearchChange,
    totalCount,
    searchLabel,
}) => {
    const { translate } = useTranslations();
    
    return (
        <SearchContainer 
            direction="row" 
            spacing={2} 
            alignItems="center" 
            justifyContent="space-between"
        >
            <Box width="30%">
                <TextField
                    label={searchLabel}
                    onChange={(e) => onSearchChange(e.target.value)}
                    value={searchQuery}
                    size="small"
                    fullWidth
                />
            </Box>
            <Typography variant="body1" color="textPrimary">
                <Typography component="span" fontWeight={700} mr={1}>
                    {totalCount}
                </Typography>
                <Typography component="span" fontWeight={300}>
                    {translate('AIAssistant.Stats.Models')}
                </Typography>
            </Typography>
        </SearchContainer>
    );
};
