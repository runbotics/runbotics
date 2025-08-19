import styled from 'styled-components';

export const RedText = styled.span`
    color: ${({ theme }) => theme.palette.error.main};
    font-weight: bold;
`;
