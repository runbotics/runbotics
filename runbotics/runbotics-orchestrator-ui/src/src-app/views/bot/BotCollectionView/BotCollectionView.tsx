import React, { MouseEvent, useEffect, useState, VFC } from 'react';

import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import useBotCollectionSearch from '#src-app/hooks/useBotCollectionSearch';
import useQuery from '#src-app/hooks/useQuery';
import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';

import BotCollectionGridView from './BotCollectionGridView';
import BotCollectionTable from './BotCollectionTable/BotCollectionTable';
import { getBotCollectionPageParams, getLimitByDisplayMode } from './BotCollectionView.utils';
import BotCollectionHeader from './Header/BotCollectionHeader';
import { useDispatch, useSelector } from '../../../store';
import { botCollectionActions, botCollectionSelector } from '../../../store/slices/BotCollections';
import { CollectionsDisplayMode } from '../BotBrowseView/BotBrowseView.utils';


const BotCollectionView: VFC = () => {
    const dispatch = useDispatch();
    const { byPage } = useSelector(botCollectionSelector);
    
    const displayMode = useSelector(state => state.botCollection.displayMode);

    const router = useRouter();
    const { firstValueFrom } = useQuery();
    const pageFromUrl = firstValueFrom('page');
    const pageSizeFromUrl = firstValueFrom('pageSize');
    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl) : 0);
    const [limit, setLimit] = useState(
        pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : getLimitByDisplayMode(displayMode),
    );

    const { search, searchField, debouncedSearch, handleSearchChange, handleAdvancedSearchChange } =
        useBotCollectionSearch();
    const replaceQueryParams = useReplaceQueryParams();
    useEffect(() => {
        const pageNotAvailable = byPage && page >= byPage.totalPages;
        if (pageNotAvailable) {
            setPage(0);
            replaceQueryParams({ page: 0, pageSize: limit, search, searchField });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [byPage]);

    useEffect(() => {
        const params = getBotCollectionPageParams(page, limit, debouncedSearch, searchField);
        dispatch(botCollectionActions.getByPage({ pageParams: params }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, displayMode, debouncedSearch, searchField]);

    const handleDisplayModeChange = (event: MouseEvent<HTMLElement>, value: CollectionsDisplayMode) => {
        setLimit(getLimitByDisplayMode(value));
        setPage(0);
        dispatch(botCollectionActions.setCollectionDisplayMode(value));
    };

    const renderGrid = () => (
        <BotCollectionGridView
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            displayMode={displayMode}
        />
    );

    const renderList = () => (
        <BotCollectionTable
            onPageChange={setPage}
            page={page}
            onPageSizeChange={setLimit}
            pageSize={limit}
            onFilterModelChange={handleAdvancedSearchChange}
        />
    );

    const collectionLength = byPage ? byPage.totalElements : 0;

    return (
        <Box display="flex" flexDirection="column" gap="1rem">
            <BotCollectionHeader
                botCollectionLength={collectionLength}
                displayMode={displayMode}
                onDisplayModeChange={handleDisplayModeChange}
                search={search}
                onSearchChange={handleSearchChange}
            />
            {displayMode === CollectionsDisplayMode.LIST ? renderList() : renderGrid()}
        </Box>
    );
};

export default BotCollectionView;
