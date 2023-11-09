import { Paper } from '@mui/material';
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
    width: 450px;
    max-width: 350px;
`;

export const StyledPaper = styled(Paper)`
    height: 100%;
`;

export const AttendancePaper = styled(StyledPaper)`
    display: flex;
    flex-direction: column;
    padding-bottom: 5px;
`;

export const ContainerWrapper = styled.div`
    display: flex;
    width: 100%;
`;
