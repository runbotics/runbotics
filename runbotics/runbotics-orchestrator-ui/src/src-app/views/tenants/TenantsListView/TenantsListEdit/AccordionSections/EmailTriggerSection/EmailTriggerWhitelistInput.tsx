import React, { KeyboardEvent, useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { IconButton, TextField } from '@mui/material';

import { EMAIL_TRIGGER_WHITELIST_PATTERN } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';

interface WhitelistInputProps {
    emailTriggerWhitelist: string[];
    onAddWhitelistItem: (item: string) => void;
}

const MAX_EMAIL_LENGTH = 50;

export const EmailTriggerWhitelistInput = ({
    emailTriggerWhitelist,
    onAddWhitelistItem,
}: WhitelistInputProps) => {
    const { translate } = useTranslations();

    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setInput(inputValue.trim());
    };

    const isInputValid = (value: string) =>
        value.length <= MAX_EMAIL_LENGTH &&
        value.match(EMAIL_TRIGGER_WHITELIST_PATTERN) &&
        !emailTriggerWhitelist.includes(input);

    const handleAdd = () => {
        onAddWhitelistItem(input);
        setInput('');
    };

    const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        const shouldAddWhitelistItem = e.key === 'Enter' && !error;

        if (shouldAddWhitelistItem) handleAdd();
    };

    useEffect(() => {
        setError(input !== '' && !isInputValid(input));
    }, [input]);

    return (
        <TextField
            label={translate('Tenants.List.Edit.Form.Input.Label.Whitelist')}
            variant="outlined"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleEnter}
            placeholder={translate(
                'Tenants.List.Edit.Form.Input.Placeholder.Whitelist'
            )}
            autoComplete="off"
            fullWidth
            error={error}
            {...(error && {
                helperText: translate(
                    'Tenants.List.Edit.Form.Input.HelperText.Whitelist'
                ),
            })}
            InputProps={{
                endAdornment: (
                    <IconButton
                        type="button"
                        onClick={handleAdd}
                        disabled={error}
                    >
                        <AddIcon />
                    </IconButton>
                ),
            }}
        />
    );
};
