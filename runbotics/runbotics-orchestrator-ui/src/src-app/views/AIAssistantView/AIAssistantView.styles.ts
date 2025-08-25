import { Container } from '@mui/material';

import styled from 'styled-components';

import Page from '#src-app/components/pages/Page';

export const StyledPage = styled(Page)(
    ({ theme }) => `
    height: 100%;
    background-color: ${theme.palette.background.default};
    overflow: hidden;
`
);

export const StyledIFrame = styled('iframe')`
    border: 0;
    height: 100%;
    width: 100%;
`;

export const StyledContainer = styled(Container)`
    @media (min-width: 1920px) {
        max-width: 1920px;
    }
`;
