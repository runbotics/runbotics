import 'styled-components';
import { Theme as MuiTheme, ZIndex as MuiZIndex } from '@mui/material';
import { TypeBackground as MuiPaletteBackground } from '@mui/material/styles';


declare module '@mui/system' {
    interface DefaultTheme extends MuiTheme { }
}

declare module '@mui/material/styles/createPalette' {
    interface TypeBackground extends MuiPaletteBackground {
        dark: string;
        white: string;
    }
}

declare module '@mui/material/styles' {
    interface Palette {
      infoIcon: {
        default: string
      };

      tag: {
        variable: string,
        action: string,
      };

      button: {
        danger: string,
      }
    }

    interface PaletteOptions {
        infoIcon: {
            default: string
          };

        tag: {
            variable: string,
            action: string,
        }

        button: {
          danger: string,
        }
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
