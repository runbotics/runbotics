import React, { FC } from 'react';

import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';

import GlobalStyles from 'src/components/utils/GlobalStyles';

import useSettings from 'src/hooks/useSettings';
import createTheme from 'src/theme';


const StylesProvider: FC = ({ children }) => {
    const { settings } = useSettings();
    const { i18n } = useTranslation();
    const theme = createTheme(settings, i18n.language);

    return (
        <StyledComponentsThemeProvider theme={theme}>
            <MuiThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <GlobalStyles />
                    {children}
                </LocalizationProvider>
            </MuiThemeProvider>
        </StyledComponentsThemeProvider>
    );
};

export default StylesProvider;
