// @ts-nocheck
import React, { PropsWithChildren } from 'react';
import { StylesProvider } from '@material-ui/styles';
import { colors, responsiveFontSizes } from '@material-ui/core';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import merge from 'lodash/merge';

export const THEMES = {
  LIGHT: 'LIGHT',
  ONE_DARK: 'ONE_DARK',
  UNICORN: 'UNICORN',
};

export const softShadows = [
  'none',
  '0 0 0 1px rgba(63,63,68,0.05), 0 1px 2px 0 rgba(63,63,68,0.15)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 2px 2px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 4px 6px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 4px 6px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 4px 8px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 5px 8px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 6px 12px -4px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 7px 12px -4px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 6px 16px -4px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 7px 16px -4px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 8px 18px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 9px 18px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 10px 20px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 11px 20px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 12px 22px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 13px 22px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 14px 24px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 16px 28px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 18px 30px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 20px 32px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 22px 34px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 24px 36px -8px rgba(0,0,0,0.25)',
];

export const strongShadows = [
  'none',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 3px 4px -2px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 2px 2px -2px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 3px 4px -2px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 3px 4px -2px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 4px 6px -2px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 4px 6px -2px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 4px 8px -2px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 5px 8px -2px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 6px 12px -4px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 7px 12px -4px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 6px 16px -4px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 7px 16px -4px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 8px 18px -8px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 9px 18px -8px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 10px 20px -8px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 11px 20px -8px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 12px 22px -8px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 13px 22px -8px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 14px 24px -8px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 16px 28px -8px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 18px 30px -8px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 20px 32px -8px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 22px 34px -8px rgba(0,0,0,0.50)',
  '0 0 1px 0 rgba(0,0,0,0.70), 0 24px 36px -8px rgba(0,0,0,0.50)',
];

const typography = {
  h1: {
    fontWeight: 500,
    fontSize: 35,
    letterSpacing: '-0.24px',
  },
  h2: {
    fontWeight: 500,
    fontSize: 29,
    letterSpacing: '-0.24px',
  },
  h3: {
    fontWeight: 500,
    fontSize: 24,
    letterSpacing: '-0.06px',
  },
  h4: {
    fontWeight: 500,
    fontSize: 20,
    letterSpacing: '-0.06px',
  },
  h5: {
    fontWeight: 500,
    fontSize: 16,
    letterSpacing: '-0.05px',
  },
  h6: {
    fontWeight: 500,
    fontSize: 14,
    letterSpacing: '-0.05px',
  },
  overline: {
    fontWeight: 500,
  },
};

const defaultSettings = {
  direction: 'ltr',
  responsiveFontSizes: true,
  theme: THEMES.LIGHT,
};

const baseConfig = {
  direction: 'ltr',
  typography,
  overrides: {
    MuiLinearProgress: {
      root: {
        borderRadius: 3,
        overflow: 'hidden',
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: 'rgba(0,0,0,0.075)',
      },
    },
  },
};

const themeConfigs = [
  {
    name: THEMES.LIGHT,
    overrides: {
      MuiInputBase: {
        input: {
          '&::placeholder': {
            opacity: 1,
            color: colors.blueGrey[600],
          },
        },
      },
    },
    palette: {
      type: 'light',
      action: {
        active: colors.blueGrey[600],
      },
      background: {
        default: colors.common.white,
        dark: '#f4f6f8',
        paper: colors.common.white,
      },
      primary: {
        main: colors.indigo[600],
      },
      secondary: {
        main: '#5850EC',
      },
      text: {
        primary: colors.blueGrey[900],
        secondary: colors.blueGrey[600],
      },
    },
    shadows: softShadows,
  },
  {
    name: THEMES.ONE_DARK,
    palette: {
      type: 'dark',
      action: {
        active: 'rgba(255, 255, 255, 0.54)',
        hover: 'rgba(255, 255, 255, 0.04)',
        selected: 'rgba(255, 255, 255, 0.08)',
        disabled: 'rgba(255, 255, 255, 0.26)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        focus: 'rgba(255, 255, 255, 0.12)',
      },
      background: {
        default: '#282C34',
        dark: '#1c2025',
        paper: '#282C34',
      },
      primary: {
        main: '#8a85ff',
      },
      secondary: {
        main: '#8a85ff',
      },
      text: {
        primary: '#e6e5e8',
        secondary: '#adb0bb',
      },
    },
    shadows: strongShadows,
  },
  {
    name: THEMES.UNICORN,
    palette: {
      type: 'dark',
      action: {
        active: 'rgba(255, 255, 255, 0.54)',
        hover: 'rgba(255, 255, 255, 0.04)',
        selected: 'rgba(255, 255, 255, 0.08)',
        disabled: 'rgba(255, 255, 255, 0.26)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        focus: 'rgba(255, 255, 255, 0.12)',
      },
      background: {
        default: '#2a2d3d',
        dark: '#222431',
        paper: '#2a2d3d',
      },
      primary: {
        main: '#a67dff',
      },
      secondary: {
        main: '#a67dff',
      },
      text: {
        primary: '#f6f5f8',
        secondary: '#9699a4',
      },
    },
    shadows: strongShadows,
  },
];

export function createTheme(settings) {
  let themeConfig = themeConfigs.find(theme => theme.name === settings.theme);

  if (!themeConfig) {
    console.warn(new Error(`The theme ${settings.theme} is not valid`));
    [themeConfig] = themeConfigs;
  }

  let theme = createMuiTheme(merge({}, baseConfig, themeConfig, { direction: settings.direction }));

  if (settings.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
}

export const Theme = (props: PropsWithChildren<{}>) => {
  return <ThemeProvider theme={createTheme(defaultSettings)}>{props.children}</ThemeProvider>;
};
