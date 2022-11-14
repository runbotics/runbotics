import React, { FC } from 'react';

import '@mui/lab';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
