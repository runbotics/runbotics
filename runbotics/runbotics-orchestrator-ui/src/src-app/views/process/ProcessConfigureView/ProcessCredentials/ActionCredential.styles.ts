import { Typography } from '@mui/material';
import styled from 'styled-components';

export const CredentialWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

export const StyledTypography = styled(Typography)(({ theme }) => `
    padding-left: 3px;
    color: ${theme.palette.grey[500]};
    text-transform: uppercase;
`);

export const HorizontalLine = styled.div(({ theme }) => `
    display: flex;
    border-bottom: 2px solid ${theme.palette.grey[400]};
    margin: 8px 90px 0 90px;
`);

export const CredentialTile = styled.div<{ $isPrimary: boolean; }>(({ theme, $isPrimary }) => ({
    display: 'flex',
    borderRadius: '10px',
    backgroundColor: $isPrimary ? theme.palette.grey[300]: theme.palette.grey[200],
    alignItems: 'center',
    height: '120px',
}));

export const CredentialSwipe = styled.div`
    display: flex;
    padding-left: 15px;
`;

export const CredentialDetails = styled.div`
    display: flex;
    flex: 1;
`;

export const CredentialDelete = styled.div`
    display: flex;
    padding-right: 15px;
`;

export const AddTile = styled.div(({ theme }) => ({
    display: 'flex',
    borderRadius: '10px',
    backgroundColor: theme.palette.grey[200],
    alignItems: 'center',
    justifyContent: 'center',
    height: '120px',
    transition: '.5s',
    [':hover']: {
        cursor: 'pointer',
        backgroundColor: theme.palette.grey[300],
    }
}));
