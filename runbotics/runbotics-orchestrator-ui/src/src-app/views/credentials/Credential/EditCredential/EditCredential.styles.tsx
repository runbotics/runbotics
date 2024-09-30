import { Box, Grid, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import styled from 'styled-components';

import InternalPage from '#src-app/components/pages/InternalPage';

export const StyledGrid = styled(Grid)(
    ({ theme }) => `
    padding: ${theme.spacing(1)};
`
);

export const CredentialsInternalPage = styled(InternalPage)`
    padding-top: 0;
    padding-bottom: 0;

    > [class*='MuiContainer'] {
        padding-left: 0;
        padding-right: 0;
    }
`;

export const PopoverTypography = styled(Typography)(
    ({ theme }) => `
    padding: ${theme.spacing(1)};
    max-width: 240px;
    background-color: ${grey[50]};
`
);

export const GoBackSpan = styled(Box)(
    ({ theme }) => `
    display: flex;
    font-weight;
    align-items: center;
    justify-content: center;

    > * {
        color: ${theme.palette.secondary.main};
    }
`
);
