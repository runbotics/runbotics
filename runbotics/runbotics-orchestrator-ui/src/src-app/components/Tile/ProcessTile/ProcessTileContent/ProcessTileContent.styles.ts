import { CardContent, Container, Box } from '@mui/material';
import styled from 'styled-components';

export const StyledContent = styled(CardContent)`
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    column-gap: 5px;
    height: 100%;
    width: 100%;

    && {
        padding: 15px 10px;
    }
`;

export const StyledContainer = styled(Container)`
    && {
        display: grid;
        grid-template-rows: 1fr 1fr;
        justify-content: flex-start;
        row-gap: 1rem;
    }
`;

export const StyledBox = styled(Box)`
   overflow: hidden;
`;

export const VerticalLine = styled.div(({ theme }) => `
    width: 1px;
    background-color: ${theme.palette.grey[300]};
`);
