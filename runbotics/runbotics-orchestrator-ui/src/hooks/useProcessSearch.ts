import { GridFilterModel } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'src/store';
import { processActions } from 'src/store/slices/Process';
import { getSearchParams } from 'src/utils/SearchParamsUtils';
import useDebounce from './useDebounce';
import useQuery from './useQuery';

const DEBOUNCE_TIME = 250;

const useProcessSearch = (pageSize = 12, page = 0) => {
    const history = useHistory();
    const query = useQuery();
    const searchFromUrl = query.get('search');
    const searchFieldFromUrl = query.get('searchField');
    const [search, setSearch] = useState(searchFromUrl || '');
    const [searchField, setSearchField] = useState(searchFieldFromUrl || '');

    const dispatch = useDispatch();
    const debouncedValue = useDebounce<string>(search, DEBOUNCE_TIME);

    useEffect(() => {
        history.replace(getSearchParams({
            page, pageSize, search, searchField,
        }));
        dispatch(processActions.getProcessesPage({
            page,
            size: pageSize,
            filter: {
                contains: {
                    ...(debouncedValue.trim() && {
                        [searchField === 'createdBy' ? 'createdByName' : 'name']: debouncedValue.trim(),
                    }),
                },
            },
        }));
    }, [debouncedValue, pageSize, searchField]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchField('name');
        setSearch(event.target.value);
    };

    const handleAdvancedSearch = (filterModel: GridFilterModel) => {
        setSearchField(filterModel.items[0].columnField);
        setSearch(filterModel.items[0].value ? filterModel.items[0].value : '');
    };

    const clearSearch = () => {
        setSearchField('');
        setSearch('');
    }

    return {
        handleSearch, search, handleAdvancedSearch, searchField, clearSearch
    };
};

export default useProcessSearch;
