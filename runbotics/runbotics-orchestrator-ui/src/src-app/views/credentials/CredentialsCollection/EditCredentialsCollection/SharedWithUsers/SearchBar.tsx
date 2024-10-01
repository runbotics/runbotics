import React, { useEffect, useRef, useState } from 'react';

import { TextField, Box, ListItemButton, ListItemText, Paper, List } from '@mui/material';
import { IUser } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';


interface SearchBarProps {
  onAddUser: (email: string) => void;
  availableUsers: IUser[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddUser, availableUsers }) => {
    const { translate } = useTranslations();
    const [searchInput, setSearchInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setFilteredUsers(availableUsers);
    }, [availableUsers]);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchInput(value);
        setFilteredUsers(availableUsers.filter(user => user.email.toLowerCase().includes(value.toLowerCase())));
    };

    const handleUserAdd = (user: IUser) => {
        setSearchInput('');
        onAddUser(user.email);
        setIsFocused(false);
        searchInputRef.current.blur();
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        if (document.activeElement !== searchInputRef.current && !listRef.current?.contains(document.activeElement)) {
            setIsFocused(false);
        }
    };

    const filteredUsersElements = filteredUsers.map(filteredUser => (
        <ListItemButton key={filteredUser.id}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
                e.preventDefault();
                handleUserAdd(filteredUser);
            }} >
            <ListItemText primary={filteredUser.email} />
        </ListItemButton>));

    return (
        <Box display="flex" alignItems="center" mb={2} position="relative">
            <TextField
                label="Search for a user"
                variant="outlined"
                value={searchInput}
                onClick={handleFocus}
                onBlur={() => handleBlur()}
                onChange={handleSearchInputChange}
                fullWidth
                inputRef={searchInputRef}
                autoComplete="off"
            >
            </TextField>
            <If condition={isFocused}>
                <Paper ref={listRef} style={{ position: 'absolute', top: '100%', zIndex: 1, width: '100%' }}>
                    <List>
                        <If condition={filteredUsersElements.length > 0} else={
                            <ListItemText sx={{ marginLeft: '4px'}}
                                primary={translate('Credentials.Collection.Add.Form.SharedWith.NoUser')}
                            />
                        }>
                            {filteredUsersElements}
                        </If>
                    </List>
                </Paper>
            </If>
        </Box>
    );
};

export default SearchBar;
