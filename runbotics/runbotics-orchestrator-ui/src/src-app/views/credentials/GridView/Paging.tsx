import React, { useContext } from 'react';

import { Pagination } from '@mui/material';

import { CredentialsPageContext } from '#src-app/providers/CredentialsPage.provider';

const Paging = ({ totalPages }) => {
    const { page, handlePageChange } = useContext(CredentialsPageContext);

    return (
        <Pagination
            count={totalPages || 1}
            onChange={handlePageChange}
            page={page + 1}
        />
    );
};

export default Paging;
