import React, { FC, MouseEvent, createContext, Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'src/store';
import { processActions } from 'src/store/slices/Process';
import useUpdateEffect from 'src/hooks/useUpdateEffect';
import { useRouter } from 'next/router';
import { ReplaceQueryParams } from 'src/views/utils/routerUtils';

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
    const router = useRouter();

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
        ReplaceQueryParams({ page: currentPage - 1, pageSize, search, searchField }, router);
        setPage(currentPage - 1);
    };

    const handleTablePageChange = (currentPage: number) => {
        ReplaceQueryParams({ page: currentPage, pageSize, search, searchField }, router);
        setPage(currentPage);
    };

    const handlePageSizeChange = (currentPageSize: number) => {
        ReplaceQueryParams({ page, pageSize: currentPageSize, search, searchField }, router);
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
