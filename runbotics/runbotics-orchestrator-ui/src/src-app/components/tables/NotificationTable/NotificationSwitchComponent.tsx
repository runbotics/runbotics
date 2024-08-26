import React, { ChangeEvent, VFC } from 'react';

import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { FormControlLabel, IconButton, Switch, Tooltip } from '@mui/material';

import { Wrapper } from '#src-app/views/process/ProcessConfigureView/BotComponent.styles';

interface NotificationSwitchProps {
    label: string;
    tooltip: string;
    isSubscribed: boolean;
    onSubscriptionChange: (isSubscribed: boolean) => void;
    onClick: () => void;
}

const NotificationSwitchComponent: VFC<NotificationSwitchProps> = ({ label, tooltip, isSubscribed, onSubscriptionChange, onClick }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSubscriptionChange(e.target.checked);
    };

    const subscriptionSwitch = (
        <Switch
            onChange={handleChange}
            checked={isSubscribed}
        />
    );

    return (
        <Wrapper>
            <NotificationsOutlinedIcon />
            <FormControlLabel
                control={subscriptionSwitch}
                label={label}
                labelPlacement="start"
                sx={{ height: '1.75rem' }}
            />
            <Tooltip title={tooltip}>
                <IconButton
                    onClick={onClick}
                    sx={{
                        marginLeft: 'auto',
                        height: '1.75rem',
                    }}
                >
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
        </Wrapper>
    );
};

export default NotificationSwitchComponent;
