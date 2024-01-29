import { Paper } from '@mui/material';
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    min-width: 375px;
`;

export const StyledPaper = styled(Paper)`
    height: 100%;
`;

export const ContainerWrapper = styled.div`
    display: flex;
    width: 100%;
`;
