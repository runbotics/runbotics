import React, {
    useEffect,
    useState, VFC,
} from 'react';
import { useSelector } from 'src/store';
import ProcessPageProvider from 'src/providers/ProcessPage.provider';
import LoadingScreen from 'src/components/utils/LoadingScreen';
import useProcessSearch from 'src/hooks/useProcessSearch';
import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import useQuery from 'src/hooks/useQuery';
import { getSearchParams } from 'src/utils/SearchParamsUtils';
import GridView from '../GridView';
import ProcessTable from '../ProcessTable/ProcessTable';
import ProcessListHeader from './Header/ProcessList.header';
import { DefaultPageSize, ProcessListDisplayMode } from './ProcessList.utils';

const ProcessList: VFC = () => {
    const { page: processesPage, loading } = useSelector((state) => state.process.all);
    const [displayMode, setDisplayMode] = useState(ProcessListDisplayMode.GRID);
    const history = useHistory();
    const query = useQuery();

    const pageFromUrl = query.get('page');
    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const pageSizeFromUrl = query.get('pageSize');
    const [pageSize, setPageSize] = useState(pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : DefaultPageSize.GRID);
    const { handleSearch, search, handleAdvancedSearch, searchField } = useProcessSearch(pageSize, page);

    useEffect(() => {
        const pageNotAvailable = processesPage && page >= processesPage.totalPages;
        if (pageNotAvailable) {
            setPage(0);
            history.replace(getSearchParams({
                page: 0, pageSize, search, searchField,
            }));
        }
    }, [processesPage]);
    if (!processesPage || loading) return <LoadingScreen />;

    return (
        <Box display="flex" flexDirection="column" gap="1.5rem">
            <ProcessListHeader
                search={search}
                onSearchChange={handleSearch}
                processesLength={processesPage?.numberOfElements ?? 0}
                displayMode={displayMode}
                onDisplayModeChange={(mode) => {
                    const newPageSize = mode === ProcessListDisplayMode.GRID
                        ? DefaultPageSize.GRID : DefaultPageSize.TABLE;
                    setPageSize(newPageSize);
                    setDisplayMode(mode);
                    history.replace(getSearchParams({
                        page, pageSize: newPageSize, search, searchField,
                    }));
                }}
            />
            <ProcessPageProvider {...{
                pageSize, setPageSize, search, searchField, page, setPage
            }}
            >
                {displayMode === ProcessListDisplayMode.GRID
                    ? <GridView />
                    : <ProcessTable onAdvancedSearchChange={handleAdvancedSearch} />}
            </ProcessPageProvider>
        </Box>
    );
};

export default ProcessList;
