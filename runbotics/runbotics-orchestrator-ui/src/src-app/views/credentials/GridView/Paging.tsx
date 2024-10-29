import { FC } from 'react';

import { Pagination } from '@mui/material';

interface PagingProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    setPage: (changeTo: number) => void;
}

const Paging: FC<PagingProps> = ({
    totalItems,
    itemsPerPage,
    currentPage,
    setPage,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setPage(page - 1);
    };

    return (
        <Pagination
            count={totalPages || 1}
            onChange={handlePageChange}
            page={currentPage + 1}
        />
    );
};

export default Paging;
