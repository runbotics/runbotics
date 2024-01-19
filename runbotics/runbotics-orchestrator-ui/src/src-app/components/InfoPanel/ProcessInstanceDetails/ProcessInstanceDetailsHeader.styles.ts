import { Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

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
