import { Select } from '@mui/material';
import styled from 'styled-components';

export const PeriodContainer = styled.div`
    font-family: 'roboto';
    display: flex;
    align-items: center;
`;

export const PeriodSelect = styled(Select)(({theme}) => `
    && { 
        margin-left: ${theme.spacing(1)};
        height: ${theme.spacing(5)};
        div {
            inline-padding: ${theme.spacing(1)} 0;
        }
    }
`);

