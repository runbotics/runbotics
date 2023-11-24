import React, { FC, useState } from 'react';

import { TextField, Autocomplete } from '@mui/material';

import { AutocompleteWidgetProps } from './AutocompleteWidget.types';

const inputDetailsDefault = {
    isComplete: true,
    replacePart: ''
};

const AutocompleteWidget: FC<AutocompleteWidgetProps> = ({
    disabled,
    autocompleteOptions,
    required,
    label,
    value,
    customErrors,
    rawErrors,
    onChange,
    handleEvent,
    handleOnBlur,
    handleOnFocus,
    name,
    autofocus,
}) => {
    const [open, setOpen] = useState(false);
    const [inputDetails, setInputDetails] = useState(inputDetailsDefault);
    const optionValues = React.useMemo(
        () => ({
            'ui:options': Object.values(autocompleteOptions).map((option) => option.value),
        }),
        [autocompleteOptions]
    );

    const analyzeInput = (input: string) => {
        const variableRegex = /[#$]\{([^{}]*)\}?/g;
        if (!input) return inputDetailsDefault;

        const matches = [...input.matchAll(variableRegex)];
        if (!matches.length) return inputDetailsDefault;

        const autocompleteResult = matches.find(match => !(optionValues['ui:options'].includes(match[0])));
        if (autocompleteResult) {
            return {
                isComplete: false,
                replacePart: autocompleteResult[0]
            };
        }
        return inputDetailsDefault;
    };

    const checkNestedVariables = (input: string) => {
        const characters = input.split('');
        let openBracketNumber = 0;

        for (const char of characters) {
            if (char === '{') openBracketNumber++;
            else if (char === '}') openBracketNumber = 0;

            if (openBracketNumber > 1) return true;
        };
        return false;
    };

    const handleInputChange = (event: any, newInputValue: string) => {
        if (
            event &&
            newInputValue &&
            !checkNestedVariables(newInputValue) &&
            !analyzeInput(newInputValue).isComplete
        ) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const handleOnClose = () => {
        setOpen(false);
    };

    const handleChange = (event: any, newValue: string) => {
        setInputDetails(analyzeInput(newValue));
        if (handleEvent) {
            onChange(event);
        } else {
            onChange(newValue || undefined);
        }
    };

    const handleAutocomplete = (event: any, newValue: string) => {
        if (newValue === null) {
            onChange('');
            return;
        }

        if (newValue !== '') {
            let targetReplace = inputDetails.replacePart;
            if (targetReplace.charAt(targetReplace.length - 1) === '}') {
                targetReplace = targetReplace.slice(0, -1);
            }

            const assertionRegex = new RegExp(`\\${targetReplace}($|})`);
            const replacedValue = value.replace(assertionRegex, newValue);
            onChange(replacedValue || undefined);
        }
    };

    return (
        <Autocomplete
            fullWidth
            disableCloseOnSelect={false}
            open={open}
            freeSolo
            value={value || ''}
            onChange={handleAutocomplete}
            onClose={handleOnClose}
            disabled={disabled}
            groupBy={(option) => autocompleteOptions[option].group}
            onInputChange={handleInputChange}
            options={optionValues['ui:options'] as any[]}
            filterOptions={(options, _) => options.filter(option => {
                const targetPart = inputDetails.replacePart;
                const targetReplace = targetPart.charAt(targetPart.length - 1) === '}'
                    ? targetPart.slice(0, -1) : targetPart;

                return option.includes(targetReplace);
            })}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    required={required}
                    label={label}
                    name={name ? name : label}
                    onChange={(event) => handleChange(event, event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(customErrors) || Boolean(rawErrors)}
                    helperText={customErrors ? customErrors[0] : null}
                    onBlur={handleOnBlur}
                    onFocus={handleOnFocus}
                    autoFocus={autofocus ?? true}
                />
            )}
        />
    );
};

export default AutocompleteWidget;
