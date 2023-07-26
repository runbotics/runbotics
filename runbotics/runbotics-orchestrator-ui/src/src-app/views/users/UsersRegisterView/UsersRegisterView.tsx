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
import { StyledButtonsContainer, StyledButton, StyledActionsContainer, StyledTextField } from './UsersRegisterView.styles';

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

    const [selectedRoles, setSelectedRoles] = useState({});
    const [selections, setSelections] = useState([]);

    const handleSelectionChange = (selection) => setSelections(selection);
    const handleSelectChange = (id, value) => setSelectedRoles({ ...selectedRoles, [id]: value});

    const handleAccept = () => {
        const payload = [];
        let status = true;
        for (const selection of selections) {
            const role = selectedRoles[selection];
            if (role) {
                const dataPayload = makePayload(selection, role);
                payload.push(dataPayload);
            } else {
                enqueueSnackbar(translate('Users.Register.View.Events.Error.RolesNotSelected'), { variant: 'error' });
                status = false;
                break;
            }
        }
        
        if (status) {
            handleSubmit(payload);
            enqueueSnackbar(translate('Users.Register.View.Events.Success.AcceptingUser'), { variant: 'success' });
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
                    <StyledButton
                        type='submit'
                        color='error'
                        variant='contained'
                        onClick={handleDelete}
                    >
                        {translate('Users.Register.View.Button.Delete')}
                    </StyledButton>
                </StyledButtonsContainer>
            </StyledActionsContainer>
            <UsersRegisterTable
                page={page}
                onPageChange={setPage}
                pageSize={limit}
                onPageSizeChange={setLimit}
                selections={selections}
                handleSelectionChange={handleSelectionChange}
                handleSelectChange={handleSelectChange}
            />
        </>
    );
};

export default UsersRegisterView;
