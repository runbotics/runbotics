import React, { FC, useEffect, useMemo, useState } from 'react';

import { Box } from '@mui/material';

import Accordion from '#src-app/components/Accordion';
import { useSelector } from '#src-app/store';


import SearchBar from './SearchBar';
import UsersTable from './UsersTable';
import { AccessType, EditCredentialsCollectionDto, PrivilegeType } from '../../CredentialsCollection.types';

export interface SharedWithUser {
    login: string;
    privilegeType: PrivilegeType;
}

interface SharedWithUsersProps {
    collection: EditCredentialsCollectionDto;
    setCredentialsCollectionData(collection: EditCredentialsCollectionDto): void;
}

export const SharedWithUsers: FC<SharedWithUsersProps> = ({ collection, setCredentialsCollectionData }) => {
    const {
        activated: { nonAdmins }
    } = useSelector(state => state.users);
    const { user: currentUser } = useSelector(state => state.auth);
    const [users, setUsers] = useState(collection.sharedWith);
    
    useEffect(() => {
        setCredentialsCollectionData({
            ...collection,
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

    const handleAddUser = (login: string) => {
        if (!users.find(user => user.login === login)) {
            setUsers([...users, { login, privilegeType: PrivilegeType.WRITE }]);
        }
    };

    const handleDeleteUser = (login: string) => {
        setUsers(users.filter(user => user.login !== login));
    };

    const handleChangeAccessType = ({login, privilegeType}: SharedWithUser) => {
        setUsers(users.map(user => (user.login === login ? { ...user, privilegeType } : user)));
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
