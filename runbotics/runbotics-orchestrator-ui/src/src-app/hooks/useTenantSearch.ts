import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { useDispatch } from '#src-app/store';
import { tenantsActions } from '#src-app/store/slices/Tenants';

import useDebounce from './useDebounce';
import useTranslations from './useTranslations';

const DEBOUNCE_TIME = 250;

interface UseTenantSearchProps {
    pageSize?: number;
    page?: number;
};

const useTenantSearchDefault: UseTenantSearchProps = {
    pageSize: 10,
    page: 0
};

const useTenantSearch = ({
    pageSize, page
}: UseTenantSearchProps = { ...useTenantSearchDefault }) => {
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

        router.replace({
            pathname: router.pathname,
            query: {
                page: newPage,
                pageSize,
                ...(search && { search })
            }
        });

        dispatch(
            tenantsActions.getAllByPage({
                page: newPage,
                size: pageSize,
                filter: {
                    contains: { 'name': debouncedValue }
                }
            }))
            .catch(() => {
                enqueueSnackbar(
                    translate('Tenants.List.View.Events.Error.FindingTenants'),
                    { variant: 'error' }
                );
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, pageSize, page, refreshTrigger]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (search !== event.target.value) setSearch(event.target.value);
    };

    const refreshSearch = () => {
        setRefreshTrigger(!refreshTrigger);
    };

    return {
        search,
        handleSearch,
        refreshSearch
    };
};

export default useTenantSearch;
