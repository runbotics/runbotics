import { Dispatch, FC, SetStateAction, createContext } from 'react';

import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';

interface PagingProps {
    page: number;
    pageSize: number;
    search: string;
    setPage: Dispatch<SetStateAction<number>>;
    totalItems: number;
    // setPageSize: Dispatch<SetStateAction<number>>;
    collectionId: string | null;
}

interface PagingContextValues {
    page: number;
    pageSize: number;
    search: string;
    totalItems: number;
    collectionId: string;
    handlePageChange: (event: React.ChangeEvent<unknown>, currentPage: number) => void;
    handlePageSizeChange: (currentPageSize: number) => void;
}

export const PagingContext = createContext<PagingContextValues>(null);

const PagingProvider: FC<PagingProps> = ({
    children,
    page,
    pageSize,
    search,
    setPage,
    totalItems = 0,
    collectionId
}) => {
    const replaceQueryParams = useReplaceQueryParams();

    const handlePageChange = (event: React.ChangeEvent<unknown>, currentPage: number) => {
        replaceQueryParams({ page: currentPage, pageSize, search });
        setPage(currentPage - 1);
    };

    const handlePageSizeChange = (currentPageSize: number) => {
        replaceQueryParams({ collectionId, page, pageSize: currentPageSize, search });
    };

    return (
        <PagingContext.Provider
            value={{
                page,
                pageSize,
                handlePageChange,
                handlePageSizeChange,
                search,
                totalItems,
                collectionId
            }}
        >
            {children}
        </PagingContext.Provider>
    );
};

export default PagingProvider;
