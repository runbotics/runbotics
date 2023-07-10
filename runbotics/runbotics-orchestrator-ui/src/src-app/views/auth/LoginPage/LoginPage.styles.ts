import styled from 'styled-components';

import Page from '#src-app/components/pages/Page';

import { classes } from './Login.page';

export const StyledPage = styled(Page)(({ theme }) => ({
    [`&.${classes.root}`]: {
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
    },

    [`& .${classes.container}`]: {
        paddingBottom: 80,
        paddingTop: 80,
    },

    [`& .${classes.card}`]: {
        boxShadow: theme.shadows[18],
        borderRadius: '20px',
    },

    [`& .${classes.content}`]: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3),
        maxWidth: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '0.75rem',
        marginBottom: '0.75rem',
    },

    [`& .${classes.option}`]: {
        marginTop: '5px',

        ['svg']: {
            marginRight: '5px',
        },

        ['span']: {
            color: theme.palette.secondary.main,
            fontWeight: 500,
        },
    },
}));
