import { Select } from '@mui/material';
import styled from 'styled-components';

export const StyledSelect = styled(Select)(({ theme }) => `
    && { 
        margin-left: ${theme.spacing(1)};
        padding: 0;
        display: flex;
        align-items: center;
        height: ${theme.spacing(5)};

        div {
            inline-padding: ${theme.spacing(1)} 0;
            min-width: ${theme.spacing(3)};
        }
    }
`);
