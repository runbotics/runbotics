import { Paper } from '@mui/material';
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    width: 450px;
    max-width: 350px;
`;

export const StyledPaper = styled(Paper)`
    height: 100%;
`;

export const ContainerWrapper = styled.div`
    display: flex;
    gap: 0.75rem;
    width: 100%;
`;
