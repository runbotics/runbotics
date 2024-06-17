import React, { useContext } from 'react';

import { Switch } from '@mui/material';

import { ChatThemeContext } from './ChatThemeProvider';

export const ChatThemeToggle = () => {
    const { handleThemeChange } = useContext(ChatThemeContext);

    return <Switch onChange={handleThemeChange} />;
};
