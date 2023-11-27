import { Box, Button } from '@mui/material';
import styled from 'styled-components';

export const StyledBox = styled(Box)`
    width: 100%;
    display: flex;

    align-items: stretch;
    justify-content: center;
`;

export const StyledButton = styled(Button)`
    && {
        min-width: 0;
        width: 35px;
        padding: 2px;
        margin-left: 5px;
    }
`;
