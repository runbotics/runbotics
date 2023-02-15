import { Select } from '@mui/material';
import styled from 'styled-components';

export const StyledSelect = styled(Select)(({ theme }) => `
    && { 
        margin-left: ${theme.spacing(1)};
        padding-inline: ${theme.spacing(2)} 0;
    }
`);
