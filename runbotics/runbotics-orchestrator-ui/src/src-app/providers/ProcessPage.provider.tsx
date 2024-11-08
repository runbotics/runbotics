import { FC, MouseEvent, createContext, Dispatch, SetStateAction } from 'react';

import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import useUpdateEffect from '#src-app/hooks/useUpdateEffect';
import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

interface ProcessPageProps {
    search: string;
    pageSize: number;
    setPageSize: Dispatch<SetStateAction<number>>;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    collectionId: string | null;
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
    pageSize,
    setPageSize,
    page,
    setPage,
    collectionId,
}) => {
    const dispatch = useDispatch();
    const replaceQueryParams = useReplaceQueryParams();

    useUpdateEffect(() => {
        if (collectionId !== undefined) {
            dispatch(
                processActions.getProcessesPage({
                    pageParams: {
                        page,
                        size: pageSize,
                        filter: {
                            contains: {
                                ...(search.trim() && {
                                    name: search.trim(),
                                    // todo: consider whether the filter should operate in OR or AND mode
                                    // 'createdBy->email': search.trim(),
                                    // 'tags->name': search.trim(),
                                }),
                            },
                            equals: {
                                processCollectionId: collectionId !== null ? collectionId : 'null',
                            },
                        },
                    }
                }),
            );
        } else {
            dispatch(
                processActions.getProcessesPage({
                    pageParams: {
                        page,
                        size: pageSize,
                        filter: {
                            contains: {
                                ...(search.trim() && {
                                    name: search.trim(),
                                    // todo: consider whether the filter should operate in OR or AND mode
                                    // 'createdBy->email': search.trim(),
                                    // 'tags->name': search.trim(),
                                }),
                            },
                        },
                    },
                }),
            );
        }
    }, [page]);

    const handleGridPageChange = (event: MouseEvent<HTMLElement>, currentPage: number) => {
        replaceQueryParams({ collectionId, page: currentPage - 1, pageSize, search });
        setPage(currentPage - 1);
    };

    const handleTablePageChange = (currentPage: number) => {
        replaceQueryParams({ page: currentPage, pageSize, search });
        setPage(currentPage);
    };

    const handlePageSizeChange = (currentPageSize: number) => {
        replaceQueryParams({ collectionId, page, pageSize: currentPageSize, search });
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
