import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { useSnackbar } from 'notistack';

import { useDispatch } from '#src-app/store';
import { usersActions } from '#src-app/store/slices/Users';

import useDebounce from './useDebounce';
import useTranslations from './useTranslations';

const DEBOUNCE_TIME = 250;

const useUserSearch = (isActivatedUsersOnly: boolean, pageSize = 10, page = 0) => {
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchFromUrl = searchParams.get('search');
    const [search, setSearch] = useState(searchFromUrl || '');
    const [refreshTrigger, setRefreshTrigger] = useState(true);

    const dispatch = useDispatch();
    const debouncedValue = useDebounce<string>(search.trim(), DEBOUNCE_TIME);

    useEffect(() => {
        const newPage = search !== '' ? 0 : page;

        if (search === '') {
            router.replace({ pathname: router.pathname, query: { page: newPage, pageSize } });
        } else {
            router.replace({ pathname: router.pathname, query: { page: newPage, pageSize, search } });
        }

        if (!isActivatedUsersOnly) {
            dispatch(
                usersActions.getAllNotActivatedByPage({
                    page: newPage,
                    size: pageSize,
                    filter: {
                        contains: { 'email': debouncedValue },
                    },
                })
            )
                .catch(() =>
                    enqueueSnackbar(
                        translate('Users.Registration.View.Events.Error.FindingUsers'),
                        { variant: 'error' })
                );
        } else {
            dispatch(
                usersActions.getAllActivatedByPage({
                    page: newPage,
                    size: pageSize,
                    filter: {
                        contains: { 'email': debouncedValue },
                    },
                })
            )
                .catch(() =>
                    enqueueSnackbar(
                        translate('Users.List.View.Events.Error.FindingUsers'),
                        { variant: 'error' })
                );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, pageSize, page, refreshTrigger]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (search !== event.target.value) setSearch(event.target.value);
    };

    const clearSearch = () => setSearch('');

    const refreshSearchNotActivated = () => {
        setRefreshTrigger(!refreshTrigger);
    };

    const refreshSearchActivated = () => {
        setRefreshTrigger(!refreshTrigger);
    };

    return {
        search,
        clearSearch,
        handleSearch,
        refreshSearchNotActivated,
        refreshSearchActivated
    };
};

export default useUserSearch;
