import { FC } from 'react';
import styled from 'styled-components';
import { Box, LinearProgress } from '@mui/material';

const PREFIX = 'SlashScreen';

const classes = {
    root: `${PREFIX}-root`,
};

const Root = styled.div(({ theme }) => ({
    [`&.${classes.root}`]: {
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        left: 0,
        padding: theme.spacing(3),
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 2000,
    },
}));

const SplashScreen: FC = () => (
    <Root className={classes.root}>
        <Box width={400}>
            <LinearProgress />
        </Box>
    </Root>
);

export default SplashScreen;
