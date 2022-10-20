import React, { MouseEvent, useEffect, useState, VFC } from 'react';
import useBotCollectionSearch from 'src/hooks/useBotCollectionSearch';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import useQuery from 'src/hooks/useQuery';
import BotCollectionHeader from './Header/BotCollectionHeader';
import { useDispatch, useSelector } from '../../../store';
import { botCollectionActions, botCollectionSelector } from '../../../store/slices/BotCollections';
import { CollectionsDisplayMode } from '../BotBrowseView/BotBrowseView.utils';
import BotCollectionGridView from './BotCollectionGridView';
import { getBotCollectionPageParams, getLimitByDisplayMode } from './BotCollectionView.utils';
import BotCollectionTable from './BotCollectionTable/BotCollectionTable';
import { ReplaceQueryParams } from 'src/views/utils/routerUtils';

const BotCollectionView: VFC = () => {
    const dispatch = useDispatch();
    const { byPage } = useSelector(botCollectionSelector);
    const [displayMode, setDisplayMode] = useState<CollectionsDisplayMode>(CollectionsDisplayMode.GRID);

    const router = useRouter();
    const query = useQuery();
    const currentPage = parseInt(query.get('page'), 10);
    const pageSizeFromUrl = query.get('pageSize');
    const [page, setPage] = useState(currentPage);
    const [limit, setLimit] = useState(
        pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : getLimitByDisplayMode(displayMode),
    );

    const { search, searchField, debouncedSearch, handleSearchChange, handleAdvancedSearchChange } =
        useBotCollectionSearch();

    useEffect(() => {
        const pageNotAvailable = byPage && page >= byPage.totalPages;
        if (pageNotAvailable) {
            setPage(0);
            ReplaceQueryParams({ page: 0, pageSize: limit, search, searchField }, router);
        }
    }, [byPage]);

    useEffect(() => {
        const params = getBotCollectionPageParams(page, limit, debouncedSearch, searchField);
        router.replace({ pathname: router.pathname, query: { page: 0, pageSize: limit, search, searchField } });

        dispatch(botCollectionActions.getByPage(params));
    }, [page, limit, displayMode, debouncedSearch, searchField]);

    const handleDisplayModeChange = (event: MouseEvent<HTMLElement>, value: CollectionsDisplayMode) => {
        setLimit(getLimitByDisplayMode(value));
        setPage(0);
        setDisplayMode(value);
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
