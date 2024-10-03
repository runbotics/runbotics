import React, { FC, useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { TextField, Autocomplete, InputAdornment, IconButton } from '@mui/material';

import If from '#src-app/components/utils/If';

import { AutocompleteWidgetProps } from './AutocompleteWidget.types';

const INPUT_AUTOCOMPLETE_DEFAULT = {
    isComplete: true,
    replacePart: ''
};

// eslint-disable-next-line max-lines-per-function
const AutocompleteWidget: FC<AutocompleteWidgetProps> = ({
    disabled,
    autocompleteOptions,
    required,
    label,
    value,
    customErrors,
    rawErrors,
    onChange,
    withName,
    handleOnBlur,
    handleOnFocus,
    name,
    autofocus,
}) => {
    const [open, setOpen] = useState(false);
    const [inputAutocompleteState, setInputAutocompleteState] = useState(INPUT_AUTOCOMPLETE_DEFAULT);
    const [isExternalOpen, setIsExternalOpen] = useState(false);
    const optionValues = React.useMemo(
        () => ({
            'ui:options': Object.values(autocompleteOptions).map((option) => option.value),
        }),
        [autocompleteOptions]
    );

    const checkInputMatches = (input: string) => {
        const variablesRegex = /[#]\{([^{}]*)\}?/g;
        if (!input) return INPUT_AUTOCOMPLETE_DEFAULT;

        const incompleteVariables = [...input.matchAll(variablesRegex)];
        if (!incompleteVariables.length) return INPUT_AUTOCOMPLETE_DEFAULT;

        const autocompleteResult = incompleteVariables.find(variable => !(optionValues['ui:options'].includes(variable[0])));
        if (autocompleteResult) {
            return {
                isComplete: false,
                replacePart: autocompleteResult[0]
            };
        }
        return INPUT_AUTOCOMPLETE_DEFAULT;
    };

    const checkNestedVariables = (input: string) => {
        const characters = input.split('');
        let openBracketNumber = 0;

        for (const char of characters) {
            if (char === '{') openBracketNumber++;
            else if (char === '}') openBracketNumber = 0;

            if (openBracketNumber > 1) return true;
        }
        return false;
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, newInputValue: string) => {
        if (
            event &&
            newInputValue &&
            !checkNestedVariables(newInputValue) &&
            !checkInputMatches(newInputValue).isComplete
        ) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const handleOnClose = () => {
        setOpen(false);
    };

    const handleChange = (newValue: string) => {
        if (withName) {
            onChange({
                name,
                value: newValue
            });
        } else {
            onChange(newValue || undefined);
        }
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string) => {
        setInputAutocompleteState(checkInputMatches(newValue));
        handleChange(newValue || undefined);
    };

    const handleAutocomplete = (event: React.ChangeEvent<HTMLSelectElement>, newValue: string) => {
        if (newValue === null) {
            handleChange('');
            return;
        }

        if (isExternalOpen) {
            const replacedValue = value
                ? value + newValue
                : newValue;
            handleChange(replacedValue);
            setIsExternalOpen(false);
            return;
        }

        if (newValue !== '') {
            let targetReplace = inputAutocompleteState.replacePart;
            if (targetReplace.charAt(targetReplace.length - 1) === '}') {
                targetReplace = targetReplace.slice(0, -1);
            }

            const assertionRegex = new RegExp(`\\${targetReplace}($|})`);
            const replacedValue = value.replace(assertionRegex, newValue);
            handleChange(replacedValue);
        }
    };

    const handleExternalOpen = () => {
        setInputAutocompleteState(prevState => ({ ...prevState, replacePart: '' }));
        setIsExternalOpen(!isExternalOpen);
    };

    return (
        <Autocomplete
            fullWidth
            disableCloseOnSelect={false}
            disableClearable
            open={open || isExternalOpen}
            freeSolo
            value={value || ''}
            onChange={handleAutocomplete}
            onClose={handleOnClose}
            disabled={disabled}
            groupBy={(option) => autocompleteOptions[option].group}
            onInputChange={handleInputChange}
            options={optionValues['ui:options'] as any[]}
            filterOptions={(options, _) => options.filter(option => {
                const targetPart = inputAutocompleteState.replacePart;
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
                    onBlur={handleOnBlur}
                    onFocus={handleOnFocus}
                    autoFocus={autofocus ?? true}
                    onChange={(event) => handleTextChange(event, event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(customErrors) || Boolean(rawErrors)}
                    helperText={customErrors ? customErrors[0] : null}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton
                                    onClick={handleExternalOpen}
                                >
                                    <If
                                        condition={isExternalOpen}
                                        else={<KeyboardArrowDownIcon/>}
                                    >
                                        <KeyboardArrowUpIcon/>
                                    </If>
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            )}
        />
    );
};

export default AutocompleteWidget;
