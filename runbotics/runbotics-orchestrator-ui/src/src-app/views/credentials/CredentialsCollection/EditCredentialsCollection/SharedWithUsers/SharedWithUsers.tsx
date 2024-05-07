import React, { FC, useMemo, useState } from 'react';


import { Box } from '@mui/material';

import Accordion from '#src-app/components/Accordion';
import { useSelector } from '#src-app/store';


import SearchBar from './SearchBar';
import UsersTable from './UsersTable';

interface User {
    email: string;
    accessType: 'READ' | 'EDIT';
  }

interface SharedWithUsersProps {
  
}

export const SharedWithUsers: FC<SharedWithUsersProps> = ({  }) => {
    const { activated: { nonAdmins } } = useSelector((state) => state.users);
    const { user: currentUser } = useSelector((state) => state.auth);
    const [users, setUsers] = useState<User[]>([]);

    const shareableUsers = useMemo(() => ({
        loading: nonAdmins.loading,
        all: nonAdmins.all.filter(user => user.email !== currentUser.email)
    }), [nonAdmins, currentUser.email]);

    const handleAddUser = (email: string) => {
        if (!users.find(user => user.email === email)) {
            setUsers([...users, { email, accessType: 'READ' }]);
        }
    };
  
    const handleDeleteUser = (email: string) => {
        setUsers(users.filter(user => user.email !== email));
    };
  
    const handleChangeAccessType = (email: string, accessType: 'READ' | 'EDIT') => {
        setUsers(users.map(user => user.email === email ? { ...user, accessType } : user));
    };
  
    return (
        <Accordion title='Access' defaultExpanded>
            <Box>

                <SearchBar onAddUser={handleAddUser} />
                <UsersTable
                    users={users}
                    onDeleteUser={handleDeleteUser}
                    onChangeAccessType={handleChangeAccessType}
                />
            </Box>
        </Accordion>
    );
};
