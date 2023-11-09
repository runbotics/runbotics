import React, { ChangeEvent, VFC } from 'react';

import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { FormControlLabel, Switch } from '@mui/material';

import { Wrapper } from '#src-app/views/process/ProcessConfigureView/BotComponent.styles';

interface NotificationSwitchProps {
    label: string;
    isSubscribed: boolean;
    onSubscriptionChange: (isSubscribed: boolean) => void;
}

const NotificationSwitchComponent: VFC<NotificationSwitchProps> = ({ label, isSubscribed, onSubscriptionChange }) => {

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
        </Wrapper>
    );
};

export default NotificationSwitchComponent;
