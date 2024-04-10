import { Button, Grid } from '@mui/material';
import styled from 'styled-components';

export const ProcessOutputButton = styled(Button)({
    textTransform: 'none',
    borderWidth: '2px',
    '&:hover': {
        borderWidth: '2px',
    },
    '&:active': {
        borderWidth: '2px',
    },
});

export const HeaderWrapper = styled(Grid)(({theme}) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${theme.spacing(2)};
`);

export const TextOutputWrapper = styled.pre`
    text-wrap: balance;
`;
