import React, { useState } from 'react';

import { GridFilterModel } from '@mui/x-data-grid';

import useDebounce from './useDebounce';
import useQuery from './useQuery';

const DEBOUNCE_TIME = 250;

const useBotCollectionSearch = () => {
    const query = useQuery();
    const searchFromUrl = query.get('search');
    const searchFieldFromUrl = query.get('searchField');
    const [search, setSearch] = useState(searchFromUrl || '');
    const [searchField, setSearchField] = useState(searchFieldFromUrl || '');

    const debouncedValue = useDebounce<string>(search, DEBOUNCE_TIME);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchField('name');
        setSearch(event.target.value);
    };

    const handleAdvancedSearchChange = (filterModel: GridFilterModel) => {
        setSearchField(filterModel.items[0].columnField);
        setSearch(filterModel.items[0].value ? filterModel.items[0].value : '');
    };

    return {
        search,
        searchField,
        debouncedSearch: debouncedValue,
        handleSearchChange,
        handleAdvancedSearchChange,
    };
};

export default useBotCollectionSearch;
