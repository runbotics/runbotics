import React, { VFC, useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import useQuery from '#src-app/hooks/useQuery';
import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import { usersActions, usersSelector } from '#src-app/store/slices/Users';

import { DefaultValues } from '../UsersBrowseView/UsersBrowseView.utils';
import UsersRegisterTable from './UsersRegisterTable';

const UsersRegisterView: VFC = () => {
    const dispatch = useDispatch();
    const { allNotActivatedByPage } = useSelector(usersSelector);

    const router = useRouter();
    const query = useQuery();
    const currentPage = query.get('page');
    const pageSizeFromUrl = query.get('pageSize');
    const [page, setPage] = useState(currentPage ? parseInt(currentPage, 10) : DefaultValues.PAGE);
    const [limit, setLimit] = useState(pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : DefaultValues.PAGE_SIZE);
    
    const replaceQueryParams = useReplaceQueryParams();

    useEffect(() => {
        const pageNotAvailable = allNotActivatedByPage && page >= allNotActivatedByPage.totalPages;
        if (pageNotAvailable) {
            setPage(0);
            replaceQueryParams({ page: 0, pageSize: limit});
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allNotActivatedByPage]);

    useEffect(() => {
        // TEMPORARY -> make function for it
        const params = { page: page, size: limit };
        router.replace({ pathname: router.pathname, query: { page: 0, pageSize: limit } });
        dispatch(usersActions.getByPageAllNotActivated(params));
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit]);

    return (
        <UsersRegisterTable
            page={page}
            onPageChange={setPage}
            pageSize={limit}
            onPageSizeChange={setLimit}
        />
    );
};

export default UsersRegisterView;
