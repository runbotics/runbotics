import { TextField } from '@mui/material';
import styled from 'styled-components';

export const FlowExpression = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    margin: 5px 5px;
`;

export const GatewayFormMenu = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 20px 10px;
`;

export const ExpressionTextField = styled(TextField)`
    margin-top: 8px;
`;
