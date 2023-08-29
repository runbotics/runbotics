import React, { FC, useState, useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { IUser } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import useUserSearch from '#src-app/hooks/useUserSearch';
import { usersSelector } from '#src-app/store/slices/Users';

import { DefaultPageValue, ROWS_PER_PAGE } from '../UsersBrowseView/UsersBrowseView.utils';
import UsersListEditDialog from './UsersListEdit';
import UsersListTable from './UsersListTable';
import { StyledActionsContainer, StyledTextField } from './UsersListView.styles';

const UsersListView: FC = () => {
    const { translate } = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = parseInt(searchParams.get('page'));
    const pageSizeFromUrl = parseInt(searchParams.get('pageSize'));
    const [page, setPage] = useState(currentPage ? currentPage : DefaultPageValue.PAGE);
    const [limit, setLimit] = useState(
        pageSizeFromUrl && ROWS_PER_PAGE.includes(pageSizeFromUrl)
            ? pageSizeFromUrl
            : DefaultPageValue.PAGE_SIZE
    );

    const { activated } = useSelector(usersSelector);
    const { search, handleSearch, refreshSearch: refreshSearchActivated } = useUserSearch({
        isActivatedUsersOnly: true,
        pageSize: limit,
        page
    });

    const [userData, setUserData] = useState<IUser>();
    const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);

    const handleOpenEditDialog = (rowData) => {
        setIsEditDialogVisible(true);
        setUserData(rowData);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogVisible(false);
    };

    useEffect(() => {
        const isPageNotAvailable = activated.allByPage?.totalPages && page >= activated.allByPage?.totalPages;
        if (isPageNotAvailable) {
            router.replace({ pathname: router.pathname, query: { page: 0, pageSize: limit } });
            setPage(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activated.allByPage]);

    useEffect(() => {
        refreshSearchActivated();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <UsersListEditDialog
                open={isEditDialogVisible}
                onClose={handleCloseEditDialog}
                userData={userData}
            />
            <StyledActionsContainer>
                <StyledTextField
                    margin='dense'
                    placeholder={translate('Users.List.View.SearchBarPlaceholder')}
                    size='small'
                    value={search}
                    onChange={handleSearch}
                />
            </StyledActionsContainer>
            <UsersListTable
                page={page}
                onPageChange={setPage}
                pageSize={limit}
                onPageSizeChange={setLimit}
                openUserEditDialog={handleOpenEditDialog}
            />
        </>
    );
};

export default UsersListView;
