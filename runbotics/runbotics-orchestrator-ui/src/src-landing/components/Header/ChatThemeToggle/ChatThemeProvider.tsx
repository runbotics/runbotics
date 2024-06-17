import React, { FC, useState } from 'react';

export enum ThemeType {
    LIGHT = 'light',
    DARK = 'dark',
}

export interface ChatThemeContext {
    currThemeType: ThemeType;
    handleThemeChange: (
        event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => void;
}

export const ChatThemeContext = React.createContext<ChatThemeContext>(null);

export const ChatThemeProvider: FC = ({ children }) => {
    const [currThemeType, setCurrThemeType] = useState(ThemeType.LIGHT);

    const handleThemeChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        if (checked) {
            setCurrThemeType(ThemeType.DARK);
            return;
        }
        setCurrThemeType(ThemeType.LIGHT);
    };

    return (
        <ChatThemeContext.Provider
            value={{
                currThemeType,
                handleThemeChange,
            }}
        >
            {children}
        </ChatThemeContext.Provider>
    );
};
