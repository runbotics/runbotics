import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import styled, { css } from 'styled-components';

export const StyledDateTimePicker = styled(DateTimePicker)<{ error: boolean }>(({ error }) => (`
    ${error && css`
    & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline, 
    .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
        border-color: #d32f2f;
    }
    
    & .MuiInputLabel-root {
        color: #d32f2f;
    }
    `};
`));

