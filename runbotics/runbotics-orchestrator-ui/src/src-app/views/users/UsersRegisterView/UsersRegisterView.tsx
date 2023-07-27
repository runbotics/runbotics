import React, { VFC, useState, useEffect } from 'react';

import { useSearchParams } from 'next/navigation'; 
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { IUser } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import useUserSearch from '#src-app/hooks/useUserSearch';
import { useDispatch } from '#src-app/store';
import { usersActions, usersSelector } from '#src-app/store/slices/Users';

import { DefaultValues, ROWS_PER_PAGE } from '../UsersBrowseView/UsersBrowseView.utils';
import UsersRegisterTable from './UsersRegisterTable';
import { StyledButtonsContainer, StyledButton, DeleteButton, StyledActionsContainer, StyledTextField } from './UsersRegisterView.styles';

interface SelectedRoles { [id: number]: string };
type hasUserRoleType = (userId: number) => boolean;

const UsersRegisterView: VFC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();

    const dispatch = useDispatch();
    const { allNotActivatedByPage } = useSelector(usersSelector);

    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = searchParams.get('page');
    const pageSizeFromUrl = searchParams.get('pageSize');
    const [page, setPage] = useState(currentPage ? parseInt(currentPage, 10) : DefaultValues.PAGE);
    const [limit, setLimit] = useState(
        pageSizeFromUrl && ROWS_PER_PAGE.includes(parseInt(pageSizeFromUrl, 10)) 
            ? parseInt(pageSizeFromUrl, 10)
            : DefaultValues.PAGE_SIZE);

    const { search, handleSearch, refreshSearch } = useUserSearch(limit, page);

    const [selectedRoles, setSelectedRoles] = useState<SelectedRoles>({});
    const [selections, setSelections] = useState<number[]>([]);

    const handleSelectedRolesChange = (id: number, value: string) =>
        setSelectedRoles({ ...selectedRoles, [id]: value});

    const handleSelectionChange = (selection) => setSelections(selection);

    const handleAccept = () => {
        const payload = [];

        const hasEveryUserSelectedRole = selections.every(checkUserRole);
        if (hasEveryUserSelectedRole) {
            selections.forEach((userId) => {
                const role = selectedRoles[userId];
                const dataPayload = makePayload(userId, role);
                payload.push(dataPayload);
            });

            handleSubmit(payload);
            enqueueSnackbar(translate('Users.Register.View.Events.Success.AcceptingUser'), { variant: 'success' });
        } else {
            enqueueSnackbar(translate('Users.Register.View.Events.Error.RolesNotSelected'), { variant: 'error' });
        }
    };
    
    const makePayload = (id: number, role: string) => {
        const { login } = allNotActivatedByPage.content.find((row) => row.id === id);
        return { id, login, roles: [role], activated: true };
    };
    
    const handleSubmit = (params: IUser[]) =>
        params.forEach((param) => dispatch(usersActions.updateNotActivated(param)));

    const handleDelete = () => {

    };

    const checkUserRole: hasUserRoleType = (userId) => !!selectedRoles[userId];
    
    useEffect(() => {
        const pageNotAvailable = allNotActivatedByPage && page >= allNotActivatedByPage.totalPages;
        if (pageNotAvailable) {
            router.replace({ pathname: router.pathname, query: { page: 0, pageSize: limit } });
            setPage(0);
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allNotActivatedByPage]);

    useEffect(() => {
        refreshSearch();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit]);

    return (
        <>
            <StyledActionsContainer>
                <StyledTextField
                    margin='dense'
                    placeholder={translate('Users.Register.View.SearchBarPlaceholder')}
                    size='small'
                    value={search}
                    onChange={handleSearch}
                />
                <StyledButtonsContainer>
                    <StyledButton
                        type='submit'
                        variant='contained'
                        color='primary'
                        onClick={handleAccept}
                        disabled={!selections.length}
                    >
                        {translate('Users.Register.View.Button.Accept')}
                    </StyledButton>
                    <DeleteButton
                        type='submit'
                        variant='contained'
                        onClick={handleDelete}
                        disabled={!selections.length}
                    >
                        {translate('Users.Register.View.Button.Delete')}
                    </DeleteButton>
                </StyledButtonsContainer>
            </StyledActionsContainer>
            <UsersRegisterTable
                page={page}
                onPageChange={setPage}
                pageSize={limit}
                onPageSizeChange={setLimit}
                selections={selections}
                handleSelectionChange={handleSelectionChange}
                handleSelectedRolesChange={handleSelectedRolesChange}
            />
        </>
    );
};

export default UsersRegisterView;
