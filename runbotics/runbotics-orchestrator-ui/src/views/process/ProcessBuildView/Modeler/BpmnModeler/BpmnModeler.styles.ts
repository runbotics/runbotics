import { Drawer, Theme } from '@mui/material';

import styled from 'styled-components';

import { MAX_DRAWER_WIDTH, MIN_DRAWER_WIDTH, DRAWER_WIDTH } from 'src/components/InfoPanel';

const prepareLeavingTransition = (theme: Theme) => theme.transitions.create(
    'width',
    {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    },
);

const prepareEnteringTransition = (theme: Theme) => theme.transitions.create(
    'width',
    {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    },
);

export const Wrapper = styled.div<{ offsetTop: number | null }>`
    display: flex;
    position: relative;
    width: 100%;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    max-height: ${(p) => (p.offsetTop ? `calc(100vh - ${p.offsetTop}px)` : '100%')};
`;

export const ModelerContainer = styled.div`
    flex: 1;
    height: 100%;
`;

export const ModelerArea = styled.div`
    position: relative;
    width: 100%;
`;

export const InfoDrawer = styled(Drawer)`
    & > [class*="MuiPaper"] {
        position: relative;
        transition: ${({ theme }) => prepareEnteringTransition(theme)};
        width: ${DRAWER_WIDTH}px;
        min-width: ${MIN_DRAWER_WIDTH}px;
        max-width: ${MAX_DRAWER_WIDTH}px;
        overflow-x: hidden;

        ${({ open, theme }) => !open && `
            width: 0;
            transition: ${prepareLeavingTransition(theme)};
            overflowX: hidden;
        `}
    }    
`;
