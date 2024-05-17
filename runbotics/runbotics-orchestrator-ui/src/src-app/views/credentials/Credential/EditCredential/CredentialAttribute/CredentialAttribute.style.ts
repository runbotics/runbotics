import { Grid, Card } from '@mui/material';
import { grey } from '@mui/material/colors';
import styled from 'styled-components';

export const StyledGridContainer = styled(Grid)(
    ({ theme }) => `
    padding: ${theme.spacing(1)};
    `
);

export const StyledAttributeCard = styled(Card)(({theme}) =>  `
    background-color: ${grey[100]};
    border: 1px solid ${grey[400]};
    min-height: 260px;
    padding: ${theme.spacing(1)};
`
);
