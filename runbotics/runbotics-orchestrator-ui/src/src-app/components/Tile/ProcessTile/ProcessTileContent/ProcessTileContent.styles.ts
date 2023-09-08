import { CardContent } from '@mui/material';
import styled from 'styled-components';

export const StyledContent = styled(CardContent)`
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    grid-template-rows: repeat(2, auto);
    justify-items: start;
    justify-content: space-evenly;
    width: 100%;

    padding: 0 1.5rem 1rem 1.5rem;
    gap: 1rem;
`;
