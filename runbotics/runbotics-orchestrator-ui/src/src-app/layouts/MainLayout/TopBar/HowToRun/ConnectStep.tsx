import { FC, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import clsx from 'clsx';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';

const PREFIX = 'ConnectStep';

const classes = {
    root: `${PREFIX}-root`,
};

const Root = styled.form(() => ({
    [`&.${classes.root}`]: {},
}));

interface ConnectStepProps {
    className?: string;
    onComplete: () => void;
    onBack?: () => void;
}

const ConnectStep: FC<ConnectStepProps> = ({ className, onComplete, ...rest }) => {
    // const [error, setError] = useState<string | null>(null);
    const { translate } = useTranslations();

    useEffect(() => {
        onComplete();
    }, [onComplete]);
    function handleSubmit() {}

    return (
        <Root onSubmit={handleSubmit} className={clsx(classes.root, className)} {...rest}>
            <Typography variant="h3" color="textPrimary">
                {translate('Install.ConnectStep.Title')}
            </Typography>
            <Box mt={2}>
                <Typography variant="subtitle1" color="textSecondary">
                    {translate('Install.ConnectStep.ConnectingMessage')}
                </Typography>
            </Box>
            {/* {error && (
                <Box mt={2}>
                    <FormHelperText error>{error}</FormHelperText>
                </Box>
            )} */}
        </Root>
    );
};

export default ConnectStep;
