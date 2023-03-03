import React, { useEffect, useState } from 'react';

import { GridFilterModel } from '@mui/x-data-grid';

import { useRouter } from 'next/router';

import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

import useDebounce from './useDebounce';
import useQuery from './useQuery';

const DEBOUNCE_TIME = 250;

const useProcessSearch = (pageSize = 12, page = 0) => {
    const query = useQuery();
    const router = useRouter();
    const searchFromUrl = query.get('search');
    const searchFieldFromUrl = query.get('searchField');
    const [search, setSearch] = useState(searchFromUrl || '');
    const [searchField, setSearchField] = useState(searchFieldFromUrl || '');
    const replaceQueryParams = useReplaceQueryParams();

    const dispatch = useDispatch();
    const debouncedValue = useDebounce<string>(search, DEBOUNCE_TIME);

    useEffect(() => {
        replaceQueryParams({
            page,
            pageSize,
            search,
            searchField,
            id: router.query.id,
            tab: router.query.tab,
        });
        dispatch(
            processActions.getProcessesPage({
                page,
                size: pageSize,
                filter: {
                    contains: {
                        ...(debouncedValue.trim() && {
                            [searchField === 'createdBy'
                                ? 'createdByName'
                                : 'name']: debouncedValue.trim(),
                        }),
                    },
                },
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    };

    return {
        handleSearch,
        search,
        handleAdvancedSearch,
        searchField,
        clearSearch,
    };
};

export default useProcessSearch;
