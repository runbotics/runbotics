import React, { useEffect, useState } from 'react';

import { GridFilterModel } from '@mui/x-data-grid';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { FeatureKey, OrderDirection, OrderPropertyName } from 'runbotics-common';

import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

import useDebounce from './useDebounce';

const DEBOUNCE_TIME = 400;

const useProcessSearch = (collectionId, pageSize = 12, page = 0) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchFromUrl = searchParams.get('search');
    const [search, setSearch] = useState(searchFromUrl || '');
    const replaceQueryParams = useReplaceQueryParams();

    const dispatch = useDispatch();
    const debouncedValue = useDebounce<string>(search, DEBOUNCE_TIME);

    const user = useSelector((state) => state.auth.user);
    const hasAllProcessesAccess = hasFeatureKeyAccess(user, [FeatureKey.ALL_PROCESSES_READ]);

    useEffect(() => {
        replaceQueryParams({
            collectionId,
            page,
            pageSize,
            search,
            id: router.query.id,
            tab: router.query.tab,
        });

        const action = hasAllProcessesAccess
            ? processActions.getProcessesAllPage
            : processActions.getProcessesPage;

        if (collectionId !== undefined) {
            dispatch(
                action({
                    pageParams: {
                        page,
                        size: pageSize,
                        sort: {
                            by: OrderPropertyName.UPDATED,
                            order: OrderDirection.DESC,
                        },
                        filter: {
                            contains: {
                                ...(search.trim() && {
                                    name: search.trim(),
                                    'createdBy->email': search.trim(),
                                    'tags->name': search.trim(),
                                }),
                            },
                            equals: {
                                processCollectionId: collectionId !== null ? collectionId : 'null',
                            },
                        },
                    },
                }),
            );
        } else {
            dispatch(
                action({
                    pageParams: {
                        page,
                        size: pageSize,
                        sort: {
                            by: OrderPropertyName.UPDATED,
                            order: OrderDirection.DESC,
                        },
                        filter: {
                            contains: {
                                ...(debouncedValue.trim() && {
                                    name: debouncedValue.trim(),
                                    'createdBy->email': search.trim(),
                                    'tags->name': search.trim(),
                                }),
                            },
                        },
                    },
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, pageSize, collectionId]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleAdvancedSearch = (filterModel: GridFilterModel) => {
        setSearch(filterModel.items[0].value ? filterModel.items[0].value : '');
    };

    const clearSearch = () => {
        setSearch('');
    };

    return {
        handleSearch,
        search,
        handleAdvancedSearch,
        clearSearch,
    };
};

export default useProcessSearch;
