import { Typography } from '@mui/material';
import styled from 'styled-components';

export const StyledTypography = styled(Typography)(({ theme }) => ({
    position: 'relative',
    '&:after': {
        position: 'absolute',
        bottom: -8,
        left: 0,
        content: '" "',
        height: 2,
        width: 48,
        backgroundColor: theme.palette.primary.main
    }
}));
