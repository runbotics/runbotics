import { Typography } from '@mui/material';

import styled from 'styled-components';

import InternalPage from 'src/components/pages/InternalPage';

export const ProcessTitle = styled(Typography)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
`;

export const ProcessInternalPage = styled(InternalPage)`
    padding-top: 0;
    padding-bottom: 0;

    > [class*="MuiContainer"] {
        padding-left: 0;
        padding-right: 0;
    }
`;
