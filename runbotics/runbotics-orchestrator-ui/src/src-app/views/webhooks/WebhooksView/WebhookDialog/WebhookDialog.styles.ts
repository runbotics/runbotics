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

export const RegistrationPayloadInfo = styled.p(({ theme }) => `
    font-size: 0.75rem;
    font-family: ${theme.typography.fontFamily};
    line-height: 166%;
    letter-spacing: 0.4px;
    color: ${theme.palette.text.secondary};
    opacity: .6;
`);
