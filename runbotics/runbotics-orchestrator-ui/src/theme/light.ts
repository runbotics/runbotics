import { colors, ThemeOptions } from '@mui/material';
import { palette } from '@mui/system';

import { softShadows } from './shadows';

type InfoIconPalette = ThemeOptions['palette'] & {
    infoIcon?: {
        default: string
    }
}
interface ExtendedThemeOptions extends Omit<ThemeOptions, 'palette'> {
    [x: string]: any;
    palette: InfoIconPalette;
}

export const lightTheme: ExtendedThemeOptions = {
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
        infoIcon: {
            default: colors.blueGrey[600], 
        },
        text: {
            primary: '#000000',
            secondary: '#000000',
        },
    },
    shadows: softShadows,
    infoIcon: palette,
};
