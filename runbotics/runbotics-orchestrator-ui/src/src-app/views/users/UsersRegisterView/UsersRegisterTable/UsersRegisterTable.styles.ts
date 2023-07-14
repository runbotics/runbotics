import { Grid, Button, MenuItem } from '@mui/material';
import styled from 'styled-components';

export const StyledGrid = styled(Grid)`
    margin-top: 20px;
`;

export const StyledButton = styled(Button)`
    width: 100px;
    &:first-child {
        margin-right: 5px;
    }
`;
