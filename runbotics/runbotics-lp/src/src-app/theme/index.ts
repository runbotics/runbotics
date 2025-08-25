import { responsiveFontSizes, Theme } from '@mui/material/';
import { plPL as corePlPL, enUS as coreEnUS } from '@mui/material/locale';
import { createTheme as createMuiTheme, ThemeOptions } from '@mui/material/styles';
import { enUS, plPL } from '@mui/x-data-grid';
import _ from 'lodash';

import { components } from './components';
import { lightTheme } from './light';
import { typography } from './typography';
import { zIndex } from './zIndex';
import { ThemeType } from '../utils/constants';

interface ThemeConfig {
    responsiveFontSizes?: boolean;
    theme?: ThemeType;
}

const baseOptions: ThemeOptions = {
    typography,
    components,
    zIndex,
};

const themes = {
    [ThemeType.LIGHT]: lightTheme,
};

const createTheme = (config: ThemeConfig, language: string): Theme => {
    const themeOptions = themes[config.theme];

    if (!themeOptions)
    // eslint-disable-next-line no-console
    { console.warn(new Error(`The theme ${config.theme} is not valid`)); }


    let theme = createMuiTheme(
        _.merge({}, baseOptions, themeOptions),
        language === 'pl' ? corePlPL : coreEnUS,
        language === 'pl' ? plPL : enUS,
    );

    if (config.responsiveFontSizes) { theme = responsiveFontSizes(theme); }


    return theme;
};

export default createTheme;
