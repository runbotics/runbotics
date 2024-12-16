import { CardContent, Typography, Box } from '@mui/material';
import styled from 'styled-components';

export const CredentialCardContainer = styled(Box)(
    ({ theme }) => `
    display: block;
    width: 100%;
    height: 100%;

    &:hover {
        cursor: pointer;

        & > * {
            background-color: ${theme.palette.action.hover};
        }
    }
`
);


export const CredentialCard = styled(CardContent)(
    ({ theme }) => `
    display: flex;
    flex-direction: column;
    color: ${theme.palette.grey[500]};

    > :first-child {
        color: black;
    }
`
);

export const CredentialCollection = styled(Typography)`
    && {
        display: flex;
    }
`;
