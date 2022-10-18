import { DialogTitle, FormControl, MenuItem } from '@mui/material';
import styled from 'styled-components';

export const LangFormControl = styled(FormControl)`
    &[class*="MuiFormControl"] {
        min-width: 120px;
        margin: 0 ${({ theme }) => theme.spacing(2)};
        height: 18px;

        [class*="MuiInputLabel"] {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }
    }
`;

export const StyledMenuItem = styled(MenuItem)`
    &[class*="MuiMenuItem"] {
        font-size: ${({ theme }) => theme.typography.pxToRem(14)};
    }
`;

export const StyledTitle = styled(DialogTitle)`
    && {
        padding-left: 0;  
        padding-top: 0;  
        padding-bottom: 2rem;
        font-size: 1.3rem;
    }
`;
