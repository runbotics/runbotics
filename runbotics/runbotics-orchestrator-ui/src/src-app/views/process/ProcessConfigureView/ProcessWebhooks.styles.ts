import { Box } from '@mui/material';
import styled from 'styled-components'

export const ProcessWebhookWrapper = styled.div(({ theme }) => `
    display: flex;
    flex-direction: column;
    flex-start,: center;
    height: 100%;
    padding: 0.5rem 1rem;
    gap: 0.3125rem;
    font-family: ${theme.typography.fontFamily};
`);

export const ProcessWebhookLabel = styled(Box)`
    display: flex;
    align-items: 'center';
    gap: 8;
    padding-bottom: 8;
`;

export const StyledLabel = styled.div(() => ({
    marginLeft: '1rem',
}));