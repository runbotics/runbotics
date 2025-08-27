import styled from 'styled-components';

export const RedText = styled.span`
    padding: 4px 12px;
    border-radius: 12px;
    color: ${({ theme }) => theme.palette.error.main};
    background-color: ${({ theme }) => theme.palette.error.light};
    font-weight: bold;
`;
