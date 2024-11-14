import React, { FC, useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { AccessType, PrivilegeType } from 'runbotics-common';

import Accordion from '#src-app/components/Accordion';

import useAuth from '#src-app/hooks/useAuth';
import { useDispatch, useSelector } from '#src-app/store';
import { usersActions } from '#src-app/store/slices/Users';

import SearchBar from './SearchBar';
import UsersTable from './UsersTable';
import { EditCredentialsCollectionDto } from '../../CredentialsCollection.types';
import { filterSharableUsers } from '../EditCredentialsCollection.utils';

export interface SharedWithUser {
    email: string;
    privilegeType: PrivilegeType;
}

interface SharedWithUsersProps {
    credentialsCollectionFormState: EditCredentialsCollectionDto;
    setCredentialsCollectionFormState: (state: (prevState: EditCredentialsCollectionDto) => EditCredentialsCollectionDto) => void;
}

export const SharedWithUsers: FC<SharedWithUsersProps> = ({ credentialsCollectionFormState, setCredentialsCollectionFormState }) => {
    const dispatch = useDispatch();
    const {
        activated: { nonAdmins }
    } = useSelector(state => state.users);

    const { user: collectionCreator } = useAuth();
    const [selectedUsers, setSelectedUsers] = useState(credentialsCollectionFormState.sharedWith || []);
    const [availableUsers, setAvailableUsers] = useState(
        filterSharableUsers('', nonAdmins.all, {
            sharedWithUsers: credentialsCollectionFormState.sharedWith,
            selectedUsers,
            collectionCreatorId: collectionCreator.id
        })
    );

    useEffect(() => {
        setAvailableUsers(
            filterSharableUsers('', nonAdmins.all, {
                sharedWithUsers: credentialsCollectionFormState.sharedWith,
                selectedUsers,
                collectionCreatorId: collectionCreator.id
            })
        );
    }, [nonAdmins.all]);

    // TODO - to be updated after users migration to include all users in tenant
    useEffect(() => {
        dispatch(usersActions.getActiveNonAdmins());
    }, []);

    useEffect(() => {
        setCredentialsCollectionFormState(prevFormState => ({
            ...prevFormState,
            accessType: selectedUsers.length > 0 ? AccessType.GROUP : AccessType.PRIVATE,
            sharedWith: selectedUsers
        }));
    }, [selectedUsers]);

    const handleAddUser = (email: string) => {
        setSelectedUsers(prevState => [...prevState, { email, privilegeType: PrivilegeType.WRITE }]);
        setAvailableUsers(prevState => prevState.filter(user => user.email !== email));
    };

    const handleDeleteUser = (email: string) => {
        setSelectedUsers(prevState => prevState.filter(user => user.email !== email));
        setAvailableUsers(prevState => [...prevState, nonAdmins.all.find(user => user.email === email)]);
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
