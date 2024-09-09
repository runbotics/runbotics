import { MouseEvent, Dispatch, SetStateAction, createContext, FC } from 'react';

import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';

interface CredentialsPageProps {
    pageSize: number;
    setPageSize: Dispatch<SetStateAction<number>>;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    collectionId: string | null;
}

interface CredentialsPageContextValues {
    page: number;
    pageSize: number;
    handlePageChange: (event: MouseEvent<HTMLElement>, currentPage: number) => void;
    handlePageSizeChange: (currentPageSize: number) => void;
}

export const CredentialsPageContext = createContext<CredentialsPageContextValues>(null);

const CredentialsPageProvider: FC<CredentialsPageProps> = ({ children, pageSize, setPageSize, page, setPage, collectionId }) => {
    const replaceQueryParams = useReplaceQueryParams();

    const handlePageChange = (event: MouseEvent<HTMLElement>, currentPage: number) => {
        replaceQueryParams({ collectionId, page: currentPage - 1, pageSize });
        setPage(currentPage - 1);
    };

    const handlePageSizeChange = (currentPageSize: number) => {
        replaceQueryParams({ collectionId, page, pageSize: currentPageSize });
        setPageSize(currentPageSize);
    };

    return (
        <CredentialsPageContext.Provider
            value={{
                page,
                pageSize,
                handlePageChange,
                handlePageSizeChange
            }}
        >
            {children}
        </CredentialsPageContext.Provider>
    );
};

export default CredentialsPageProvider;
