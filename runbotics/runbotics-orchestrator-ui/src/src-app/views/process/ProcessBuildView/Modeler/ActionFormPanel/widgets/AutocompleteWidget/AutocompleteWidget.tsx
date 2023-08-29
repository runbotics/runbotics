import React, { FC, useState } from 'react';

import { TextField, Autocomplete } from '@mui/material';

import { AutocompleteWidgetProps } from './AutocompleteWidget.types';

const AutocompleteWidget: FC<AutocompleteWidgetProps> = ({
    disabled,
    autocompleteOptions,
    required,
    label,
    value,
    customErrors,
    rawErrors,
    onChange
}) => {
    const [open, setOpen] = useState(false);
    const optionValues = React.useMemo(
        () => ({
            'ui:options': Object.values(autocompleteOptions).map((option) => option.value),
        }),
        [autocompleteOptions]
    );

    const handleInputChange = (event: any, newInputValue: string) => {
        if (
            event &&
            newInputValue &&
            (newInputValue.startsWith('$') || newInputValue.startsWith('#'))
        ) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const handleOnClose = () => {
        setOpen(false);
    };

    const handleChange = (event: any, newValue: any) => {
        onChange(newValue || undefined);
    };
    return (
        <Autocomplete
            fullWidth
            autoSelect
            autoComplete
            disableCloseOnSelect={false}
            autoHighlight
            open={open}
            freeSolo
            value={value || ''}
            onChange={handleChange}
            onClose={handleOnClose}
            disabled={disabled}
            groupBy={(option) => autocompleteOptions[option].group}
            onInputChange={handleInputChange}
            options={optionValues['ui:options'] as any[]}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    required={required}
                    label={label}
                    onChange={(event) => handleChange(event, event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(customErrors) || Boolean(rawErrors)}
                    helperText={customErrors ? customErrors[0] : null}
                />
            )}
        />
    );
};

export default AutocompleteWidget;
