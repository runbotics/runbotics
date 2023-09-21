import { CardContent } from '@mui/material';
import styled from 'styled-components';

export const StyledContent = styled(CardContent)(({ theme }) => `
    display: grid;
    grid-template-columns: 2fr 1.9fr;
    gap: 1rem;
    width: 100%;
    background: linear-gradient(${theme.palette.grey[300]}, ${theme.palette.grey[300]}) center/1.5px 80% no-repeat;

    && {
        padding: 1rem 0 1.5rem 2.5rem;
    }
`);
