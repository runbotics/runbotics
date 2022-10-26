import 'styled-components';
import {
    Theme as MuiTheme, TypeBackground as MuiPaletteBackground, ZIndex as MuiZIndex,
} from '@mui/material/styles';

declare module '@mui/system' {
    interface DefaultTheme extends MuiTheme { }
}

declare module '@mui/material/styles/createPalette' {
    interface TypeBackground extends MuiPaletteBackground {
        dark: string;
    }
}

declare module '@mui/material/styles/zIndex' {
    interface ZIndex extends MuiZIndex {
        header: number;
        navbar: number
    }
}

declare module 'styled-components' {
    export interface DefaultTheme extends MuiTheme { }
}
