import { CardContent, Typography } from '@mui/material';
import styled from 'styled-components';

export const CredentialCard = styled(CardContent)<{ collectionColor: string }>(
    ({ theme, collectionColor }) => `
    && {
        border-left: 4px solid ${collectionColor || theme.palette.primary.light};
        cursor: pointer;
    }

    &:hover {
        background-color: ${theme.palette.action.hover};
    }
`
);

export const CredentialCollection = styled(Typography)(
    ({ theme }) => `
    && {
        color: ${theme.palette.grey[500]};
        text-transform: lowercase;
        display: flex;
    }

`
);
