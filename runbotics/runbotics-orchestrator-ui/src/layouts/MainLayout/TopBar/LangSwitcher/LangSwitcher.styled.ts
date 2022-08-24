import { FormControl } from '@mui/material';
import styled from 'styled-components';

export const LangFormControl = styled(FormControl)`
    &[class*="MuiFormControl"] {
        min-width: 150px;
        margin: 0 ${({ theme }) => theme.spacing(2)};
    }
`;
