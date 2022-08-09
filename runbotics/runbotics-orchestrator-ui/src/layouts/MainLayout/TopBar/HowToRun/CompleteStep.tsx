import React, { FC, FormEvent, useState } from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import {
    Box, Button, FormHelperText, Typography,
} from '@mui/material';
import useTranslations from 'src/hooks/useTranslations';

const PREFIX = 'CompleteStep';

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

interface CompleteStepProps {
    className?: string;
    onComplete: () => void;
    onBack?: () => void;
}

const CompleteStep: FC<CompleteStepProps> = ({
    className, onBack, onComplete, ...rest
}) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { translate } = useTranslations();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onComplete();
    };

    return (
        <Root onSubmit={handleSubmit} className={clsx(classes.root, className)} {...rest}>
            <Typography variant="h3" color="textPrimary">
                {translate('Install.CompletedStep.Title')}
            </Typography>
            <Box mt={2}>
                <Typography variant="subtitle1" color="textSecondary">
                    {translate('Install.CompletedStep.Completed')}
                </Typography>
            </Box>
            {error && (
                <Box mt={2}>
                    <FormHelperText error>{FormHelperText}</FormHelperText>
                </Box>
            )}
            <Box mt="auto" display="flex">
                <Box flexGrow={1} />
                <Box>
                    <Button color="secondary" disabled={isSubmitting} type="submit" variant="contained" size="large">
                        {translate('Common.Complete')}
                    </Button>
                </Box>
            </Box>
        </Root>
    );
};

export default CompleteStep;
