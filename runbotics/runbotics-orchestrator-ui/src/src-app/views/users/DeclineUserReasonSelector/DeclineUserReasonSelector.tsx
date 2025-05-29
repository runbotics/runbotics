import * as React from 'react';

import { TextField, Typography } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledFormControl, StyledRadioGroup } from './DeclineUserReasonSelector.styles';
import { RadioControl } from './RadioControl';

interface DeclineUserReasonSelectorProps {
    onMessageChange: (message: string) => void;
}

enum DeclineReason {
    CUSTOM_REASON = 'FIRST_REASON',
    DEFAULT_REASON = 'DEFAULT_REASON'
}

export const DeclineUserReasonSelector = ({
    onMessageChange,
}: DeclineUserReasonSelectorProps) => {
    const { translate } = useTranslations();
    const [customMessage, setCustomMessage] = React.useState('');
    const [reason, setReason] = React.useState(DeclineReason.DEFAULT_REASON);

    const declineReason = {
        [DeclineReason.CUSTOM_REASON]: {
            value: DeclineReason.CUSTOM_REASON,
            message: translate(
                'Users.Actions.Modals.DeleteModal.DeclineReason.RadioControl.Label.CustomReason'
            ),
        },
        [DeclineReason.DEFAULT_REASON]: {
            value: DeclineReason.DEFAULT_REASON,
            message: translate(
                'Users.Actions.Modals.DeleteModal.DeclineReason.RadioControl.Label.DefaultReason'
            ),
        }
    };

    const handleRadioControlChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const inputValue = (event.target as HTMLInputElement).value as DeclineReason;

        if (
            reason !== DeclineReason.CUSTOM_REASON &&
            inputValue === DeclineReason.CUSTOM_REASON
        ) {
            onMessageChange(`${declineReason[inputValue].message} ${customMessage}`);
        } else {
            onMessageChange(declineReason[inputValue].message);
        }
        setReason(inputValue);
    };

    const handleTextFiledChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const inputValue = (event.target as HTMLInputElement).value;

        if (reason === DeclineReason.CUSTOM_REASON) {
            onMessageChange(inputValue);
            setCustomMessage(inputValue);
        }
    };

    return (
        <StyledFormControl>
            <Typography variant="h5">
                {translate(
                    'Users.Actions.Modals.DeleteModal.DeclineReason.RadioControl.Title'
                )}
            </Typography>
            <StyledRadioGroup value={reason} onChange={handleRadioControlChange}>
                <RadioControl
                    label={declineReason[DeclineReason.DEFAULT_REASON].message}
                    value={declineReason[DeclineReason.DEFAULT_REASON].value}
                />
                <RadioControl
                    label={declineReason[DeclineReason.CUSTOM_REASON].message}
                    value={declineReason[DeclineReason.CUSTOM_REASON].value}
                />
                <TextField
                    label={translate(
                        'Users.Actions.Modals.DeleteModal.DeclineReason.TextField.Label.Message'
                    )}
                    multiline
                    rows={4}
                    value={customMessage}
                    onChange={handleTextFiledChange}
                    disabled={reason !== DeclineReason.CUSTOM_REASON}
                />
            </StyledRadioGroup>
        </StyledFormControl>
    );
};
