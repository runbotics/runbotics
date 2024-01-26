import React, { useEffect, useState, VFC } from 'react';

import { Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import If from '#src-app/components/utils/If';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useLoading from '#src-app/hooks/useLoading';
import useProcessSearch from '#src-app/hooks/useProcessSearch';
import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import ProcessPageProvider from '#src-app/providers/ProcessPage.provider';
import { useSelector } from '#src-app/store';

import ProcessListHeader from './Header/ProcessList.header';
import { DefaultPageSize, ProcessListDisplayMode, LOADING_DEBOUNCE } from './ProcessList.utils';
import GridView from '../GridView';
import ProcessTable from '../ProcessTable/ProcessTable';
import ProcessCollectionList from '../../../../components/Tile/ProcessCollectionTile/ProcessCollectionList';

const ProcessList: VFC = () => {
    const { page: processesPage, loading: isStoreLoading } = useSelector((state) => state.process.all);
    const [displayMode, setDisplayMode] = useState(ProcessListDisplayMode.GRID);
    const showLoading = useLoading(isStoreLoading, LOADING_DEBOUNCE);
    const searchParams = useSearchParams();

    const pageFromUrl = searchParams.get('page');
    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const pageSizeFromUrl = searchParams.get('pageSize');
    const [pageSize, setPageSize] = useState(pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : DefaultPageSize.GRID);
    const { handleSearch, search, handleAdvancedSearch, searchField, clearSearch } = useProcessSearch(pageSize, page);
    const replaceQueryParams = useReplaceQueryParams();

    useEffect(() => {
        const pageNotAvailable = processesPage && page >= processesPage.totalPages;
        if (pageNotAvailable) {
            setPage(0);
            replaceQueryParams({ page: 0, pageSize, search, searchField });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processesPage]);

    return (
        <Box display="flex" flexDirection="column" gap="1.5rem"> 
            <ProcessCollectionList />
            <ProcessListHeader
                search={search}
                onSearchChange={handleSearch}
                processesLength={processesPage?.numberOfElements ?? 0}
                displayMode={displayMode}
                onDisplayModeChange={(mode) => {
                    const newPageSize =
                        mode === ProcessListDisplayMode.GRID ? DefaultPageSize.GRID : DefaultPageSize.TABLE;
                    setPageSize(newPageSize);
                    if (mode) setDisplayMode(mode);
                    replaceQueryParams({ page, pageSize: newPageSize, search, searchField });
                    clearSearch();
                }}
            />
            <ProcessPageProvider
                {...{
                    pageSize,
                    setPageSize,
                    search,
                    searchField,
                    page,
                    setPage,
                }}
            >
                <If condition={displayMode === ProcessListDisplayMode.GRID}>
                    <If condition={!showLoading} else={<LoadingScreen />}>
                        <GridView />
                    </If>
                </If>

                <If condition={displayMode === ProcessListDisplayMode.LIST}>
                    <ProcessTable onAdvancedSearchChange={handleAdvancedSearch} />
                </If>
            </ProcessPageProvider>
        </Box>
    );
};

export default ProcessList;
