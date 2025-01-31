import * as React from 'react';

import { TextField, Typography } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledFormControl, StyledRadioGroup } from './DeclineUserReasonSelector.styles';
import { RadioControl } from './RadioControl';

interface DeclineUserReasonSelectorProps {
    onMessageChange: (message: string) => void;
}

enum DeclineReason {
    FIRST_REASON = 'FIRST_REASON',
    SECOND_REASON = 'SECOND_REASON',
    THIRD_REASON = 'THIRD_REASON',
}

export const DeclineUserReasonSelector = ({
    onMessageChange,
}: DeclineUserReasonSelectorProps) => {
    const { translate } = useTranslations();
    const [customMessage, setCustomMessage] = React.useState('');
    const [reason, setReason] = React.useState<string | null>(null);

    const declineReason = {
        [DeclineReason.FIRST_REASON]: {
            value: DeclineReason.FIRST_REASON,
            message: translate(
                'Users.Actions.Modals.DeleteModal.DeclineReason.RadioControl.Label.FirstReason'
            ),
        },
        [DeclineReason.SECOND_REASON]: {
            value: DeclineReason.SECOND_REASON,
            message: translate(
                'Users.Actions.Modals.DeleteModal.DeclineReason.RadioControl.Label.SecondReason'
            ),
        },
        [DeclineReason.THIRD_REASON]: {
            value: DeclineReason.THIRD_REASON,
            message: translate(
                'Users.Actions.Modals.DeleteModal.DeclineReason.RadioControl.Label.ThirdReason'
            ),
        },
    };

    const handleRadioControlChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const inputValue = (event.target as HTMLInputElement).value;

        setReason(inputValue);
        if (
            reason !== DeclineReason.THIRD_REASON &&
            inputValue === DeclineReason.THIRD_REASON
        ) {
            onMessageChange(customMessage);
        } else {
            onMessageChange(declineReason[inputValue].message);
        }
    };

    const handleTextFiledChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const inputValue = (event.target as HTMLInputElement).value;

        if (reason === DeclineReason.THIRD_REASON) {
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
                    label={declineReason[DeclineReason.FIRST_REASON].message}
                    value={declineReason[DeclineReason.FIRST_REASON].value}
                />
                <RadioControl
                    label={declineReason[DeclineReason.SECOND_REASON].message}
                    value={declineReason[DeclineReason.SECOND_REASON].value}
                />
                <RadioControl
                    label={declineReason[DeclineReason.THIRD_REASON].message}
                    value={declineReason[DeclineReason.THIRD_REASON].value}
                />
                <TextField
                    label={translate(
                        'Users.Actions.Modals.DeleteModal.DeclineReason.TextField.Label.Message'
                    )}
                    multiline
                    rows={4}
                    value={customMessage}
                    onChange={handleTextFiledChange}
                />
            </StyledRadioGroup>
        </StyledFormControl>
    );
};
