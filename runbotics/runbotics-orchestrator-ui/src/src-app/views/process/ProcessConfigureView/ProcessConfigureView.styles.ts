import { Paper } from '@mui/material';
import styled from 'styled-components';

export const PageContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
`;

export const SettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
    min-width: 375px;
`;

export const CredentialsContainer = styled.div`
    width: 100%;
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    padding: 1.5rem;
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
    display: flex
    flex: 1;
    width: 100%;
`;
