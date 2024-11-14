import { CardContent, Typography } from '@mui/material';
import styled from 'styled-components';

export const CredentialCard = styled(CardContent)(
    ({ theme }) => `
    display: flex;
    flex-direction: column;
    color: ${theme.palette.grey[500]};
    cursor: pointer;
    min-height: 190px;

    > :first-child {
        color: black;
    }

    &:hover {
        background-color: ${theme.palette.action.hover};
    }
`
);
export const CredentialCollection = styled(Typography)`
    && {
        display: flex;
    }

`;
