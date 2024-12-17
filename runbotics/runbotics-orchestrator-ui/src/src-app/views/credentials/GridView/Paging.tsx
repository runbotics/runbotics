import { useContext } from 'react';

import { Pagination } from '@mui/material';

import { PagingContext } from './Paging.provider';

const Paging = () => {
    const { page: currentPage, pageSize, totalItems, handlePageChange } = useContext(PagingContext);
    const totalPages = Math.ceil(totalItems / pageSize);

    return (
        <Pagination
            count={totalPages || 1}
            onChange={handlePageChange}
            page={currentPage + 1}
        />
    );
};

export default Paging;
