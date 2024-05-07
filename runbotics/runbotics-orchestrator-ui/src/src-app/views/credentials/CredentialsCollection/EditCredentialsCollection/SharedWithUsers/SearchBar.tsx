import React, { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { TextField, IconButton, Box } from '@mui/material';

interface SearchBarProps {
  onAddUser: (email: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddUser }) => {
    const [email, setEmail] = useState('');

    const handleAddUser = () => {
        if (email) {
            onAddUser(email);
            setEmail('');
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleAddUser();
        }
    };

    return (
        <Box display="flex" alignItems="center" mb={2}>
            <TextField
                label="Search for a user"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
            />
            <IconButton color="primary" onClick={handleAddUser}>
                <AddIcon />
            </IconButton>
        </Box>
    );
};

export default SearchBar;
