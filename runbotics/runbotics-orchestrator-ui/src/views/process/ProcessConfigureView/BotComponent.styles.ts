import styled from 'styled-components';

export const Wrapper = styled.div(({ theme }) => `
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0.5rem;
    gap: 0.3125rem;
    font-family: ${theme.typography.fontFamily};
    font-weight: bold;
`);
