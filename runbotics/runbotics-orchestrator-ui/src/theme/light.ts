import { colors, ThemeOptions } from '@mui/material';

import { softShadows } from './shadows';

export const lightTheme: ThemeOptions = {
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    '&::placeholder': {
                        opacity: 1,
                        color: colors.blueGrey[600],
                    },
                },
            },
        },
    },
    palette: {
        mode: 'light',
        action: {
            active: colors.blueGrey[600],
        },
        background: {
            default: 'rgb(251, 251, 253)',
            dark: 'rgb(251, 251, 253)',
            paper: 'rgb(251, 251, 253)',
        },
        primary: {
            main: '#EA8E05',
        },
        secondary: {
            main: '#FBB040',
        },
        text: {
            primary: '#000000',
            secondary: '#000000',
        },
    },
    shadows: softShadows,
};
