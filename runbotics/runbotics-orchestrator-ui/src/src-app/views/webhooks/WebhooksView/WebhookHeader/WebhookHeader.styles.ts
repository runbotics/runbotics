import  styled from 'styled-components';

export const WebhookHeaderContainer = styled.div(({ theme }) => `
    display: flex;
    flex-direction: column;
    font-family: ${theme.typography.fontFamily};

    width: 100%;
    gap: 1.5rem;
`
);

export const WebhookHeaderTitle = styled.h2`
    height: 2rem;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2rem;
`;


export const WebhookHeaderTokenContainer = styled.div(({ theme }) => `
    display: flex;
    gap: 1.5rem;
    padding: 1rem;

    align-content: center;
    align-items: center;
    justify-content: flex-start;

    background-color: ${theme.palette.grey[100]};
`
);


