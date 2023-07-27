import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { useDispatch } from '#src-app/store';
import { usersActions } from '#src-app/store/slices/Users';

import useDebounce from './useDebounce';

const DEBOUNCE_TIME = 250;

const useUserSearch = (pageSize = 10, page = 0) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchFromUrl = searchParams.get('search');
    const [search, setSearch] = useState(searchFromUrl || '');

    const dispatch = useDispatch();
    const debouncedValue = useDebounce<string>(search, DEBOUNCE_TIME);

    useEffect(() => {
        const newPage = search !== '' ? 0 : page;

        router.replace({ pathname: router.pathname, query: { page: newPage, pageSize, search } });
        dispatch(
            usersActions.getAllNotActivatedByPage({
                page: newPage,
                size: pageSize,
                filter: {
                    contains: {
                        ...(debouncedValue.trim() && { 'email': debouncedValue.trim() }),
                    },
                },
            })
        ).catch((err) => { throw err; });
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, pageSize, page]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (search !== event.target.value) setSearch(event.target.value);
    };

    const refreshSearch = () => {
        setSearch(search);
    };

    const clearSearch = () => {
        setSearch('');
    };

    return {
        search,
        handleSearch,
        clearSearch,
        refreshSearch
    };
};

export default useUserSearch;
