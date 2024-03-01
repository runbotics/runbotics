import React, { useEffect, useState } from 'react';

import { GridFilterModel } from '@mui/x-data-grid';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

import useDebounce from './useDebounce';

const DEBOUNCE_TIME = 250;

const useProcessSearch = (collectionId, pageSize = 12, page = 0) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchFromUrl = searchParams.get('search');
    const searchFieldFromUrl = searchParams.get('searchField');
    const [search, setSearch] = useState(searchFromUrl || '');
    const [searchField, setSearchField] = useState(searchFieldFromUrl || '');
    const replaceQueryParams = useReplaceQueryParams();

    const dispatch = useDispatch();
    const debouncedValue = useDebounce<string>(search, DEBOUNCE_TIME);

    useEffect(() => {
        replaceQueryParams({
            collectionId,
            page,
            pageSize,
            search,
            searchField,
            id: router.query.id,
            tab: router.query.tab,
        });

        if (collectionId !== undefined) {
            dispatch(
                processActions.getProcessesPageByCollection({
                    page,
                    size: pageSize,
                    filter: {
                        contains: {
                            ...(search.trim() && {
                                name: search.trim(),
                                createdByName: search.trim(),
                                tagName: search.trim(),
                            })
                        },
                        equals: {
                            collectionId
                        }
                    },
                })
            );
        } else {
            dispatch(
                processActions.getProcessesPage({
                    page,
                    size: pageSize,
                    filter: {
                        contains: {
                            ...(debouncedValue.trim() && {
                                name: debouncedValue.trim(),
                                createdByName: debouncedValue.trim(),
                                tagName: debouncedValue.trim()
                            })
                        },
                    },
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, pageSize, searchField, collectionId]);

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
