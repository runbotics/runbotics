import { styled } from '@mui/material';

import Page from '#src-app/components/pages/Page';

const PREFIX = 'UnsubscribedView';

export const classes = {
    root: `${PREFIX}-root`,
};

export const StyledPage = styled(Page)(({ theme }) => ({
    [`&.${classes.root}`]: {
        backgroundColor: theme.palette.background.white,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
        paddingTop: 80,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        isolation: 'isolate',
    },
}));
