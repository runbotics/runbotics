import React, { useEffect, useState, VFC } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'src/store';
import ProcessPageProvider from 'src/providers/ProcessPage.provider';
import LoadingScreen from 'src/components/utils/LoadingScreen';
import useProcessSearch from 'src/hooks/useProcessSearch';
import { Box } from '@mui/material';
import useQuery from 'src/hooks/useQuery';
import GridView from '../GridView';
import ProcessTable from '../ProcessTable/ProcessTable';
import ProcessListHeader from './Header/ProcessList.header';
import { DefaultPageSize, ProcessListDisplayMode, LOADING_DEBOUNCE } from './ProcessList.utils';
import If from 'src/components/utils/If';
import useLoading from 'src/hooks/useLoading';
import { ReplaceQueryParams } from 'src/views/utils/routerUtils';

const ProcessList: VFC = () => {
    const { page: processesPage, loading: isStoreLoading } = useSelector((state) => state.process.all);
    const [displayMode, setDisplayMode] = useState(ProcessListDisplayMode.GRID);
    const showLoading = useLoading(isStoreLoading, LOADING_DEBOUNCE);
    const router = useRouter();
    const query = useQuery();

    const pageFromUrl = query.get('page');
    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const pageSizeFromUrl = query.get('pageSize');
    const [pageSize, setPageSize] = useState(pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : DefaultPageSize.GRID);
    const { handleSearch, search, handleAdvancedSearch, searchField, clearSearch } = useProcessSearch(pageSize, page);

    useEffect(() => {
        const pageNotAvailable = processesPage && page >= processesPage.totalPages;
        if (pageNotAvailable) {
            setPage(0);
            ReplaceQueryParams({ page: 0, pageSize, search, searchField }, router);
        }
    }, [processesPage]);

    return (
        <Box display="flex" flexDirection="column" gap="1.5rem">
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
                    ReplaceQueryParams({ page, pageSize: newPageSize, search, searchField }, router);
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
