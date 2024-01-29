import styled from 'styled-components';

export const Wrapper = styled.div(({ theme }) => `
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0.5rem 1rem;
    gap: 0.3125rem;
    font-family: ${theme.typography.fontFamily};
`);

export const StyledLabel = styled.div(() => ({
    marginLeft: '1rem',
}));
