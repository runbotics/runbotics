import { blueGrey, grey } from '@mui/material/colors';

import { CustomThemeOptions } from '.';
import { softShadows } from './shadows';

export const lightTheme: CustomThemeOptions = {
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    '&::placeholder': {
                        opacity: 1,
                        color: blueGrey[600],
                    },
                },
            },
        },
    },
    palette: {
        mode: 'light',
        action: {
            active: blueGrey[600],
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
        infoIcon: {
            default: blueGrey[600],
        },
        button: {
            danger: blueGrey[700],
        },
        tag: {
            variable: blueGrey[100],
            action: blueGrey[50]
        },
        text: {
            primary: '#000000',
            secondary: '#000000',
        },
    },
    shadows: softShadows,
    customShadow: {
        card: `0 0.25rem 0.5rem 0 ${grey[400]}`,
    }
};
