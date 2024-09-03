import { CardContent, Typography } from '@mui/material';
import styled from 'styled-components';

export const CredentialCard = styled(CardContent)<{ collectionColor: string }>(
    ({ theme, collectionColor }) => `
    display: flex;
    flex-direction: column;
    color: ${theme.palette.grey[500]};
    border-left: 4px solid ${collectionColor || theme.palette.primary.light};
    cursor: pointer;
    
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
