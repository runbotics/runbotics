import styled from 'styled-components';

export const WebhookContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;
`;

export const WebhookRegistrationPayloadContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

export const RegistrationPayloadInfo = styled.p`
    font-size: 0.75rem;
    line-height: 166%;
    letter-spacing: 0.4px;
    color: ${({theme})=> theme.palette.text.secondary};
    opacity: .6;
`;
