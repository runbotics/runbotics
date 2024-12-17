import { FC, useContext } from 'react';

import { Box, TextField } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { PagingContext } from '../Paging.provider';

interface SearchProps {
    handleSearch: (value: string) => void;
}

const Search: FC<SearchProps> = ({ handleSearch }) => {
    const { translate } = useTranslations();
    const { search } = useContext(PagingContext);

    return (
        <Box width="30%">
            <TextField
                id="credential-search"
                fullWidth
                size="small"
                label={translate('Bot.Collection.Header.Search.Label')}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}>
                {translate('Common.Search')}
            </TextField>
        </Box>
    );
};

export default Search;
