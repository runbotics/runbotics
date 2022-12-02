import { FC, MouseEvent, createContext, Dispatch, SetStateAction } from 'react';

import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import useUpdateEffect from '#src-app/hooks/useUpdateEffect';
import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

interface ProcessPageProps {
    search: string;
    searchField: string;
    pageSize: number;
    setPageSize: Dispatch<SetStateAction<number>>;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
}

interface ProcessPageContextValues {
    page: number;
    search: string;
    pageSize: number;
    handleGridPageChange: (event: MouseEvent<HTMLElement>, currentPage: number) => void;
    handleTablePageChange: (currentPage: number) => void;
    handlePageSizeChange: (currentPageSize: number) => void;
}

export const ProcessPageContext = createContext<ProcessPageContextValues>(null);

const ProcessPageProvider: FC<ProcessPageProps> = ({
    children,
    search,
    searchField,
    pageSize,
    setPageSize,
    page,
    setPage,
}) => {
    const dispatch = useDispatch();
    const replaceQueryParams = useReplaceQueryParams();

    useUpdateEffect(() => {
        dispatch(
            processActions.getProcessesPage({
                page,
                size: pageSize,
                filter: {
                    contains: { ...(search.trim() && { name: search.trim() }) },
                },
            }),
        );
    }, [page]);

    const handleGridPageChange = (event: MouseEvent<HTMLElement>, currentPage: number) => {
        replaceQueryParams({ page: currentPage - 1, pageSize, search, searchField });
        setPage(currentPage - 1);
    };

    const handleTablePageChange = (currentPage: number) => {
        replaceQueryParams({ page: currentPage, pageSize, search, searchField });
        setPage(currentPage);
    };

    const handlePageSizeChange = (currentPageSize: number) => {
        replaceQueryParams({ page, pageSize: currentPageSize, search, searchField });
        setPageSize(currentPageSize);
    };

    return (
        <ProcessPageContext.Provider
            value={{
                page,
                pageSize,
                handleGridPageChange,
                handleTablePageChange,
                handlePageSizeChange,
                search,
            }}
        >
            {children}
        </ProcessPageContext.Provider>
    );
};

export default ProcessPageProvider;
