import { FC, FormEvent, useEffect, useState } from 'react';

import { Box, Button, FormHelperText, Typography } from '@mui/material';
import clsx from 'clsx';
import { IProcess } from 'runbotics-common';
import styled from 'styled-components';

import BotProcessRunner from '#src-app/components/BotProcessRunner';
import useTranslations from '#src-app/hooks/useTranslations';
import Axios from '#src-app/utils/axios';

const PREFIX = 'RunStep';

const classes = {
    root: `${PREFIX}-root`,
};

const Root = styled.form({
    [`&.${classes.root}`]: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
});

interface RunStepProps {
    className?: string;
    onComplete: () => void;
    onBack?: () => void;
}

const RunStep: FC<RunStepProps> = ({ className, onBack, ...rest }) => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const [error, setError] = useState<string | null>(null);
    const [helloProcess, setHelloProcess] = useState<IProcess>();
    const { translate } = useTranslations();

    useEffect(() => {
        (async () => {
            const response = await Axios.get<IProcess[]>('/api/processes?name.equals=Hello');
            try {
                const process = response.data[0];
                setHelloProcess(process);
            } catch (e) {
                setError(translate('Install.Errors.ProcessNotFound'));
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <Root onSubmit={handleSubmit} className={clsx(classes.root, className)} {...rest}>
            <Typography variant="h3" color="textPrimary">
                {translate('Install.RunStep.Title')}
            </Typography>
            <Box mt={2}>
                <Typography variant="subtitle1" color="textSecondary">
                    {translate('Install.RunStep.Run')}
                </Typography>
            </Box>
            {error && (
                <Box mt={2}>
                    <FormHelperText error>{error}</FormHelperText>
                </Box>
            )}
            <Box mt="auto" display="flex">
                {onBack && (
                    <Button onClick={onBack} size="large">
                        {translate('Common.Cancel')}
                    </Button>
                )}
                <Box flexGrow={1} />

                <Box>
                    {helloProcess && <BotProcessRunner process={helloProcess} /* onClose={() => onComplete()} */ />}
                </Box>
            </Box>
        </Root>
    );
};

export default RunStep;
