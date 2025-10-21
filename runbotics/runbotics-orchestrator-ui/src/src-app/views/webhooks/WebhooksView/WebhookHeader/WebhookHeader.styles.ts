import  styled from 'styled-components';

export const WebhookHeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    
    width: 100%;
    gap: 1.5rem;
`;

export const WebhookHeaderTitle = styled.h2`
    height: 2rem;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2rem;
`;


export const WebhookHeaderTokenContainer = styled.div`
    display: flex;
    gap: 1.5rem;
    padding: 1rem;
    
    align-content: center;
    align-items: center;
    justify-content: flex-start;
    
    background-color: ${({ theme }) => theme.palette.grey[100]};
`;

export const WebhookHeaderTokenText = styled.p`
    font-size: 0.875rem;
    
    color: ${({ theme }) => theme.palette.text.secondary};
    opacity: .6;
`;
