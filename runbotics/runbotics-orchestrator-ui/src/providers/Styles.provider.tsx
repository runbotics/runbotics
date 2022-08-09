import React, { FC } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';

import GlobalStyles from 'src/components/utils/GlobalStyles';
import useSettings from 'src/hooks/useSettings';
import createTheme from 'src/theme';

const StylesProvider: FC = ({ children }) => {
    const { settings } = useSettings();
    const theme = createTheme(settings);

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
