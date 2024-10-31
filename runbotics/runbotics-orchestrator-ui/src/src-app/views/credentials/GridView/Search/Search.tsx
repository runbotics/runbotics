import React, { FC } from 'react';

import { Box, TextField } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

interface SearchProps {
    searchValue: string;
    handleSearch: (value: string) => void;
}

const Search: FC<SearchProps> = ({ searchValue, handleSearch }) => {
    const { translate } = useTranslations();

    return (
        <Box width="30%">
            <TextField
                id="credential-search"
                fullWidth
                size="small"
                label={translate('Bot.Collection.Header.Search.Label')}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}>
                {translate('Common.Search')}
            </TextField>
        </Box>
    );
};

export default Search;
