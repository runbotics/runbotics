import { Grid } from '@mui/material';
import styled from 'styled-components';

export const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2rem;
    width: 90vw;
    max-width: 1200px;
    height: 85vh;
    max-height: 1080px;
`;

export const StyledHeaderWrapper = styled(Grid)(({theme}) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${theme.spacing(2)};
`);
