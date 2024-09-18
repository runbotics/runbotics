import React, { useRef, useState } from 'react';

import { TextField, Box, ListItemButton, ListItemText, Paper, List } from '@mui/material';
import { IUser } from 'runbotics-common';

import If from '#src-app/components/utils/If';

interface SearchBarProps {
  onAddUser: (email: string) => void;
  availableUsers: IUser[];
  setAvailableUsers: (state: ((prevState: IUser[]) => IUser[])) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddUser, availableUsers, setAvailableUsers }) => {
    const [searchInput, setSearchInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchInput(value);
        setAvailableUsers((prevState) => prevState.filter(user => user.email.toLowerCase().includes(value.toLowerCase())));
    };

    const handleUserAdd = (user: IUser) => {
        setSearchInput('');
        onAddUser(user.email);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (document.activeElement !== searchInputRef.current && !listRef.current?.contains(document.activeElement)) {
                setIsFocused(false);
            }
        }, 100);
    };

    const filteredUsersElements = availableUsers.map(filteredUser => (
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
        </Box>
    );
};

export default SearchBar;
