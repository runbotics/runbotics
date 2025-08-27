import React, { Dispatch, SetStateAction, FC, useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { AccessType, PrivilegeType } from 'runbotics-common';

import Accordion from '#src-app/components/Accordion';

import useAuth from '#src-app/hooks/useAuth';
import { useDispatch, useSelector } from '#src-app/store';
import { usersActions } from '#src-app/store/slices/Users';

import SearchBar from './SearchBar';
import UsersTable from './UsersTable';
import { EditCredentialsCollectionWithCreatorDto } from '../../CredentialsCollection.types';
import { filterSharableUsers } from '../EditCredentialsCollection.utils';

export interface SharedWithUser {
    email: string;
    privilegeType: PrivilegeType;
}

interface SharedWithUsersProps {
    credentialsCollectionFormState: EditCredentialsCollectionWithCreatorDto;
    setCredentialsCollectionFormState: Dispatch<SetStateAction<EditCredentialsCollectionWithCreatorDto>>;
}

export const SharedWithUsers: FC<SharedWithUsersProps> = ({ credentialsCollectionFormState, setCredentialsCollectionFormState }) => {
    const dispatch = useDispatch();
    const {
        tenantActivated: { all }
    } = useSelector(state => state.users);

    const { user: currentUser } = useAuth();
    const [selectedUsers, setSelectedUsers] = useState(credentialsCollectionFormState.sharedWith || []);
    const [availableUsers, setAvailableUsers] = useState(
        filterSharableUsers('', all, {
            sharedWithUsers: credentialsCollectionFormState.sharedWith,
            selectedUsers,
            collectionCreatorId: credentialsCollectionFormState.createdById,
            currentUserId: currentUser.id,
        })
    );

    useEffect(() => {
        setAvailableUsers(
            filterSharableUsers('', all, {
                sharedWithUsers: credentialsCollectionFormState.sharedWith,
                selectedUsers,
                collectionCreatorId: credentialsCollectionFormState.createdById,
                currentUserId: currentUser.id,
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [all]);

    useEffect(() => {
        dispatch(usersActions.getAllUsersInTenant());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setCredentialsCollectionFormState(prevFormState => ({
            ...prevFormState,
            accessType: selectedUsers.length > 0 ? AccessType.GROUP : AccessType.PRIVATE,
            sharedWith: selectedUsers
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUsers]);

    const handleAddUser = (email: string) => {
        setSelectedUsers(prevState => [...prevState, { email, privilegeType: PrivilegeType.WRITE }]);
        setAvailableUsers(prevState => prevState.filter(user => user.email !== email));
    };

    const handleDeleteUser = (email: string) => {
        setSelectedUsers(prevState => prevState.filter(user => user.email !== email));
        setAvailableUsers(prevState => [...prevState, all.find(user => user.email === email)]);
    };

    const handleChangeAccessType = ({ email, privilegeType }: SharedWithUser) => {
        setSelectedUsers(
            selectedUsers.map(selectedUser => (selectedUser.email === email ? { ...selectedUser, privilegeType } : selectedUser))
        );
    };

    return (
        <Accordion title="Access" defaultExpanded>
            <Box>
                <SearchBar onAddUser={handleAddUser} availableUsers={availableUsers} />
                <UsersTable users={selectedUsers} onDeleteUser={handleDeleteUser} onChangeAccessType={handleChangeAccessType} />
            </Box>
        </Accordion>
    );
};
