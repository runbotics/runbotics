import React, {
    FC, FormEvent, useEffect, useState,
} from 'react';

import GetAppIcon from '@mui/icons-material/GetApp';
import {
    Box, Button, FormHelperText, Typography,
} from '@mui/material';
import clsx from 'clsx';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';
import Axios from '#src-app/utils/axios';

const PREFIX = 'InstallStep';

const classes = {
    root: `${PREFIX}-root`,
    editorContainer: `${PREFIX}-editorContainer`,
    editor: `${PREFIX}-editor`,
};

const Root = styled.form(({ theme }) => ({
    [`&.${classes.root}`]: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },

    [`& .${classes.editorContainer}`]: {
        marginTop: theme.spacing(3),
    },

    [`& .${classes.editor}`]: {
        '& .ql-editor': {
            height: 400,
        },
    },
}));

interface InstallStepProps {
    className?: string;
    onComplete: () => void;
    onBack?: () => void;
}

const isInstalled = async () => {
    const response = await Axios.get('scheduler/bots/current-user');
    return response.data?.connected;
};

const InstallStep: FC<InstallStepProps> = ({
    className, onBack, onComplete, ...rest
}) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { translate } = useTranslations();

    useEffect(() => {
        const installBot = async () => {
            const installed = await isInstalled();
            if (installed)
            { onComplete(); }

        };
        const interval = setInterval(() => {
            installBot();
        }, 2000);
        return () => {
            clearInterval(interval);
        };
    });

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            setSubmitting(true);
            const installed = await isInstalled();
            if (installed)
            { onComplete(); }
            else
            { setError(translate('Install.Errors.NotInstalled')); }

        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };
    const handleDownload = async () => {
        const response = await Axios.post<{ fileId: string }>('/api/bot-installation/download', {});
        const { data } = response;
        window.open(`/api/bot-installation/files/${data.fileId}`);
    };
    return (
        <Root onSubmit={handleSubmit} className={clsx(classes.root, className)} {...rest}>
            <Typography variant="h3" color="textPrimary">
                {translate('Install.StepInstall.Title')}
            </Typography>
            <Box mt={2}>
                <Typography variant="subtitle1" color="textSecondary">
                    {translate('Install.StepInstall.Download')}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {translate('Install.StepInstall.AfterInstallation')}
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
                <Box mr={2}>
                    <Button onClick={handleDownload} endIcon={<GetAppIcon />} size="large" variant="contained">
                        {translate('Common.Download')}
                    </Button>
                </Box>
                <Box>
                    <Button color="secondary" disabled={isSubmitting} type="submit" variant="contained" size="large">
                        {translate('Common.Next')}
                    </Button>
                </Box>
            </Box>
        </Root>
    );
};

export default InstallStep;
