import styled from 'styled-components';

export const GenerateTokenButton = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-width: fit-content;

`;

export const TokenContainer = styled.div`
    display: flex;
    flex: 11;
    flex-direction: column;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.palette.text.secondary};
    opacity: .6;
    gap: 1rem;
    overflow: hidden;
`;

export const TokenInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
`;

export const ExpirationDate = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .25rem;
`;

export const Token = styled.div`
    display: flex;
    max-width: 100%;
    flex-wrap: wrap;
    overflow-wrap: anywhere;
    word-break: break-all;
    white-space: normal;
`;
