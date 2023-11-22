import React, { ChangeEvent, VFC } from 'react';

import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { FormControlLabel, IconButton, Switch, Tooltip } from '@mui/material';

import { Role } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useRole from '#src-app/hooks/useRole';
import { Wrapper } from '#src-app/views/process/ProcessConfigureView/BotComponent.styles';

interface NotificationSwitchProps {
    label: string;
    tooltip: string;
    isSubscribed: boolean;
    onSubscriptionChange: (isSubscribed: boolean) => void;
    onClick: () => void;
}

const NotificationSwitchComponent: VFC<NotificationSwitchProps> = ({ label, tooltip, isSubscribed, onSubscriptionChange, onClick }) => {
    const isAdmin = useRole([Role.ROLE_ADMIN]);

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
            <If condition={isAdmin}>
                <Tooltip title={tooltip}>
                    <IconButton
                        onClick={() => onClick()}
                        sx={{
                            marginLeft: 'auto',
                            height: '1.75rem',
                        }}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
            </If>
        </Wrapper>
    );
};

export default NotificationSwitchComponent;
