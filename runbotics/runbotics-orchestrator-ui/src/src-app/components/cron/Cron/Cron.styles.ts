import { Button } from '@mui/material';
import styled from 'styled-components';

export const CronContainer = styled.div<{isError: boolean}>(({ theme, isError }) => `
    font-family: 'roboto';
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    border: ${isError ? `2px solid ${theme.palette.error.main}` : 'none'};
    border-radius: 5px;
`);

export const ClearButton = styled(Button)(({ theme }) => `
    && {
        margin-left: ${theme.spacing(1)};
        background-color: ${theme.palette.grey.A700};
        color: ${theme.palette.error.contrastText};
        &:hover {
            background-color: ${theme.palette.common.black};
        }
    }
`);
