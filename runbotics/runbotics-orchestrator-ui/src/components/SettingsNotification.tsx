import React, { useState, useEffect, FC } from 'react';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import { Box, Button, Paper, Typography } from '@mui/material';
import Portal from '@mui/material/Portal';
import useSettings from 'src/hooks/useSettings';
import { ThemeType } from 'src/utils/constants';
import useTranslations from 'src/hooks/useTranslations';

const PREFIX = 'SettingsNotification';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledPortal = styled(Portal)(({ theme }) => ({
    [`& .${classes.root}`]: {
        maxWidth: 420,
        position: 'fixed',
        top: 0,
        right: 0,
        margin: theme.spacing(3),
        outline: 'none',
        zIndex: 2000,
        padding: theme.spacing(2),
    },
}));

const SettingsNotification: FC = () => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const { saveSettings } = useSettings();
    const { translate } = useTranslations();

    const handleSwitch = (): void => {
        saveSettings({ theme: ThemeType.LIGHT });
        Cookies.set('settingsUpdated', 'true');
        setOpen(false);
    };

    const handleClose = (): void => {
        Cookies.set('settingsUpdated', 'true');
        setOpen(false);
    };

    useEffect(() => {
        const settingsUpdated = Cookies.get('settingsUpdated');

        if (!settingsUpdated) setOpen(true);
    }, []);

    if (!isOpen) return null;

    return (
        <StyledPortal>
            <Paper className={classes.root} elevation={3}>
                <Typography variant="h4" color="textPrimary" gutterBottom>
                    {translate('Component.SettingsNotification.Title')}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {translate('Component.SettingsNofigication.Message')}
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button onClick={handleClose}>{translate('Common.Close')}</Button>
                    <Button color="secondary" variant="contained" onClick={handleSwitch}>
                        {translate('Common.Switch')}
                    </Button>
                </Box>
            </Paper>
        </StyledPortal>
    );
};

export default SettingsNotification;
