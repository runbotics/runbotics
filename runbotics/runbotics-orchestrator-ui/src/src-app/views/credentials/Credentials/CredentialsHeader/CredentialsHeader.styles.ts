import { Typography } from '@mui/material';
import styled from 'styled-components';

export const StyledTypography = styled(Typography)(({ theme }) => ({
    position: 'relative',

    '&:after': {
        position: 'absolute',
        bottom: '-8px',
        left: '0%',
        content: '" "',
        height: '2px',
        width: '48%',
        backgroundColor: theme.palette.secondary.main
    }
}));
