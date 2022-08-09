import styled from 'styled-components';

export const Wrapper = styled.div(({ theme }) => `
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    width: 100%;
    background-color: ${theme.palette.background.default};
`);
