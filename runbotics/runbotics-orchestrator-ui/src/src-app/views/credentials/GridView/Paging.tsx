

import { Pagination } from '@mui/material';

const Paging = ({
    totalItems,
    itemsPerPage,
    currentPage,
    setPage
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
