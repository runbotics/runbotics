import React, { useState } from 'react';
import { Autocomplete, TextField, AutocompleteProps } from '@mui/material';
import { translate } from 'src/hooks/useTranslations';
import { Item } from '../ListGroup';

export type SearchBarProps = Omit<AutocompleteProps<Item, false, false, false>, 'renderInput'> & {};

const ActionSearch = ({ ...other }: SearchBarProps) => {
    const [inputValue, setInputValue] = useState('');
    const [highlightedValue, setHighlightedValue] = useState<Item>();
    const [value, setValue] = useState<Item>(null);

    const handleKeyDown: React.KeyboardEventHandler = (event) => {
        if (event.key === 'Enter') {
            event.stopPropagation();
            setInputValue(highlightedValue.label);
        }
    };

    const handleBlur = () => {
        setInputValue('');
        setValue(null);
    };

    return (
        <Autocomplete
            {...other}
            value={value}
            inputValue={inputValue}
            onBlur={handleBlur}
            onInputChange={(_, value) => setInputValue(value)}
            onHighlightChange={(_, value) => setHighlightedValue(value)}
            isOptionEqualToValue={(action, value) => value.label === action.label}
            size="small"
            sx={{ width: 'calc(100% - 40px)' }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    inputProps={{
                        ...params.inputProps,
                        onKeyDown: handleKeyDown,
                    }}
                    label={translate('Process.Details.Modeler.ActionListPanel.Search.Label')}
                    variant="outlined"
                />
            )}
        />
    );
};

export default ActionSearch;
