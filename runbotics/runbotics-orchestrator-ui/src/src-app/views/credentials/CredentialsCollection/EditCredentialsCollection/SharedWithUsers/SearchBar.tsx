import React, { useCallback, useRef, useState } from 'react';

import { TextField, Box, ListItemButton, ListItemText, Paper, List } from '@mui/material';
import { IUser } from 'runbotics-common';

import If from '#src-app/components/utils/If';

interface SearchBarProps {
  onAddUser: (email: string) => void;
  sharableUsers: IUser[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddUser, sharableUsers }) => {
    const [searchInput, setSearchInput] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchInput(value);
        
        const filtered = sharableUsers.filter((sharableUser) =>
            sharableUser.email.toLowerCase().includes(value.toLowerCase())
            && !selectedUsers.some((selectedUser) => selectedUser.id === sharableUser.id)
        );
        setFilteredUsers(filtered);
    };

    const handleUserAdd = (user: IUser) => {
        setSearchInput('');
        setFilteredUsers([]);
        setSelectedUsers([...selectedUsers, user]);
        onAddUser(user.email);
    };

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        setFilteredUsers(sharableUsers.filter(sharableUser => 
            sharableUser.email.toLowerCase().includes(searchInput.toLowerCase())
            && !selectedUsers.some((selectedUser) => selectedUser.id === sharableUser.id)
        ));
    }, [searchInput, sharableUsers, selectedUsers]);

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            if (document.activeElement !== searchInputRef.current && !listRef.current?.contains(document.activeElement)) {
                setIsFocused(false);
                setFilteredUsers([]);
            }
        }, 100);
    }, []);

    const filteredUsersElements = filteredUsers.map(filteredUser => (
        <ListItemButton key={filteredUser.id} onClick={() => handleUserAdd(filteredUser)} >
            <ListItemText primary={filteredUser.email} />
        </ListItemButton>));

    return (
        <Box display="flex" alignItems="center" mb={2} position="relative">
            <TextField
                label="Search for a user"
                variant="outlined"
                value={searchInput}
                onFocus={handleFocus}
                onChange={handleSearchInputChange}
                fullWidth
                onBlur={handleBlur}
                inputRef={searchInputRef}
            >

            </TextField>
            <If condition={isFocused}>
                <Paper ref={listRef} style={{ position: 'absolute', top: '100%', zIndex: 1, width: '100%' }}>
                    <List>
                        {filteredUsersElements}
                    </List>
                </Paper>
            </If>
            {/* <IconButton color="primary" onClick={handleUserAdd}>
                <AddIcon />
            </IconButton> */}
        </Box>
    );
};

export default SearchBar;
