import React, { ChangeEvent, VFC } from 'react';

import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { FormControlLabel, Switch } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { Wrapper } from './BotComponent.styles';

interface ProcessNotificationProps {
    isProcessSubscribed: boolean;
    onSubscriptionChange: (isSubscribed: boolean) => void;
}

const ProcessNotificationComponent: VFC<ProcessNotificationProps> = ({ isProcessSubscribed, onSubscriptionChange }) => {
    const { translate } = useTranslations();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSubscriptionChange(e.target.checked);
    };

    const subscriptionSwitch = (
        <Switch
            onChange={handleChange}
            checked={isProcessSubscribed}
        />
    );

    return (
        <Wrapper>
            <NotificationsOutlinedIcon />
            <FormControlLabel
                control={subscriptionSwitch}
                label={translate('Process.Edit.Form.Fields.IsSubscribed.Label')}
                labelPlacement="start"
                sx={{ height: '1.75rem' }}
            />
        </Wrapper>
    );
};

export default ProcessNotificationComponent;
