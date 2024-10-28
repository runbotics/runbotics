import { Grid } from '@mui/material';
import styled from 'styled-components';


export const StyledHeaderGrid = styled(Grid)(
    ({ theme }) => `
    margin-bottom: ${theme.spacing(2)};
`);
