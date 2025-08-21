import { Container } from '@mui/material';

import styled from 'styled-components';

import Page from '#src-app/components/pages/Page';

export const StyledPage = styled(Page)(
    ({ theme }) => `
    min-height: 100%;
    padding-top: ${theme.spacing(3)};
    padding-bottom: ${theme.spacing(3)};
    background-color: ${theme.palette.background.default};
`
);

export const StyledContainer = styled(Container)`
    @media (min-width: 1920px) {
        max-width: 1920px;
    }
`;
