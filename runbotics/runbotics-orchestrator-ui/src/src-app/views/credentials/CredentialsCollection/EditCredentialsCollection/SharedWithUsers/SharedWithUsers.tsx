import React, { FC, useEffect, useMemo, useState } from 'react';

import { Box } from '@mui/material';

import Accordion from '#src-app/components/Accordion';
import { useSelector } from '#src-app/store';


import SearchBar from './SearchBar';
import UsersTable from './UsersTable';
import { AccessType, EditCredentialsCollectionDto, PrivilegeType } from '../../CredentialsCollection.types';

export interface SharedWithUser {
    email: string;
    privilegeType: PrivilegeType;
}

interface SharedWithUsersProps {
    credentialsCollectionFormState: EditCredentialsCollectionDto;
    setCredentialsCollectionFormState(collection: EditCredentialsCollectionDto): void;
}

export const SharedWithUsers: FC<SharedWithUsersProps> = ({ credentialsCollectionFormState, setCredentialsCollectionFormState }) => {
    const {
        activated: { nonAdmins }
    } = useSelector(state => state.users);
    const { user: currentUser } = useSelector(state => state.auth);
    const [users, setUsers] = useState(credentialsCollectionFormState.sharedWith);
    
    useEffect(() => {
        setCredentialsCollectionFormState({
            ...credentialsCollectionFormState,
            accessType: users.length > 0 ? AccessType.GROUP : AccessType.PRIVATE,
            sharedWith: users,
        });
    }, [users]);

    const shareableUsers = useMemo(
        () => ({
            loading: nonAdmins.loading,
            all: nonAdmins.all.filter(user => user.email !== currentUser.email)
        }),
        [nonAdmins, currentUser.email]
    );

    const handleAddUser = (email: string) => {
        if (!users.find(user => user.email === email)) {
            setUsers([...users, { email, privilegeType: PrivilegeType.WRITE }]);
        }
    };

    const handleDeleteUser = (email: string) => {
        setUsers(users.filter(user => user.email !== email));
    };

    const handleChangeAccessType = ({email, privilegeType}: SharedWithUser) => {
        setUsers(users.map(user => (user.email === email ? { ...user, privilegeType } : user)));
    };

    return (
        <Accordion title="Access" defaultExpanded>
            <Box>
                <SearchBar onAddUser={handleAddUser} sharableUsers={shareableUsers.all}/>
                <UsersTable users={users} onDeleteUser={handleDeleteUser} onChangeAccessType={handleChangeAccessType} />
            </Box>
        </Accordion>
    );
};
