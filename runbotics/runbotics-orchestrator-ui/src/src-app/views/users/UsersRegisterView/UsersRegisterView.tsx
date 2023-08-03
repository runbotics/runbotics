import React, { FC, useState, useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { Role, IUser } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import useUserSearch from '#src-app/hooks/useUserSearch';
import { useDispatch } from '#src-app/store';
import { usersActions, usersSelector } from '#src-app/store/slices/Users';

import DeleteUserDialog from '../DeleteUser';
import { DefaultPageValue, ROWS_PER_PAGE } from '../UsersBrowseView/UsersBrowseView.utils';
import UsersRegisterTable from './UsersRegisterTable';
import { StyledButtonsContainer, StyledButton, DeleteButton, StyledActionsContainer, StyledTextField } from './UsersRegisterView.styles';

interface SelectedRoles { [id: number]: Role };
interface MapActivatedUserParams {
    id: number;
    login: string;
    roles: Role[];
    activated: boolean;
}

const UsersRegisterView: FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const dispatch = useDispatch();
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

    const { notActivated } = useSelector(usersSelector);
    const { search, handleSearch, refreshSearch } = useUserSearch(false, limit, page);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<SelectedRoles>({});
    const [selections, setSelections] = useState<number[]>([]);

    const handleSelectedRolesChange = (id: number, value: Role) =>
        setSelectedRoles((prevState) => ({ ...prevState, [id]: value }));

    const handleSelectionChange = (selection) => setSelections(selection);

    const checkUserHasSelectedRole = (userId: number): boolean => !!selectedRoles[userId];

    const handleAccept = () => {
        const hasEveryUserSelectedRole = selections.every(checkUserHasSelectedRole);
        if (!hasEveryUserSelectedRole) {
            enqueueSnackbar(translate('Users.Register.View.Events.Error.RolesNotSelected'), { variant: 'error' });
            return;
        }

        const payload = selections.map((userId) => {
            const role = selectedRoles[userId];
            return mapUserActivateRequest(userId, role);
        });

        handleSubmit(payload);
    };

    const mapUserActivateRequest = (id: number, role: Role): MapActivatedUserParams => {
        const { login } = notActivated.allByPage.content.find((row) => row.id === id);
        return { id, login, roles: [role], activated: true };
    };

    const handleSubmit = (usersData: IUser[]) =>
        Promise
            .allSettled(
                usersData.map((user) => dispatch(usersActions.updateNotActivated(user))))
            .then(() => {
                enqueueSnackbar(translate('Users.Register.View.Events.Success.AcceptingUser'), { variant: 'success' });
                refreshSearch();
            })
            .catch(() => {
                enqueueSnackbar(translate('Users.Register.View.Events.Error.AcceptFailed'), { variant: 'error' });
            });

    const handleDelete = () => setShowDeleteDialog(true);

    const sendSelectedUsersToDeleteModal = (): IUser[] => notActivated.allByPage.content.filter((user) => selections.includes(user.id));

    useEffect(() => {
        const isPageNotAvailable = notActivated.allByPage?.totalPages && page >= notActivated.allByPage?.totalPages;
        if (isPageNotAvailable) {
            router.replace({ pathname: router.pathname, query: { page: 0, pageSize: limit } });
            setPage(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notActivated.allByPage]);

    useEffect(() => {
        refreshSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <DeleteUserDialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                getSelectedUsers={sendSelectedUsersToDeleteModal}
            />
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
