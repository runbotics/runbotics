import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';
import { Button } from '@mui/material';
import React from 'react';
import useTranslations from 'src/hooks/useTranslations';

const PREFIX = 'Loader';

const classes = {
    root: `${PREFIX}-root`,
    progress: `${PREFIX}-progress`,
};

const Root = styled.div(({ theme }) => ({
    [`&.${classes.root}`]: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flex: '1 0 auto',
    },

    [`& .${classes.progress}`]: {
        margin: theme.spacing(2),
    },
}));

interface LoaderProps {
    error?: boolean;
    retry?: (event: React.MouseEvent<HTMLElement>) => void;
    timedOut?: boolean;
    pastDelay?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
    error, retry, timedOut, pastDelay,
}) => {
    const { translate } = useTranslations();

    return (
        <Root className={classes.root}>
            {error && (
                <div>
                    {translate('Component.Loading.Error')}
                    {' '}
                    <Button onClick={retry}>{translate('Common.Retry')}</Button>
                </div>
            )}
            {timedOut && (
                <div>
                    {translate('Component.Loading.TakingLongTime')}
                    {' '}
                    <Button onClick={retry}>{translate('Common.Retry')}</Button>
                </div>
            )}
            {pastDelay && <div>{translate('Component.Loading.Loading')}</div>}
            <CircularProgress className={classes.progress} />
        </Root>
    );
};

export default Loader;
