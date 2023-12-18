import { Button } from '@mui/material';
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
