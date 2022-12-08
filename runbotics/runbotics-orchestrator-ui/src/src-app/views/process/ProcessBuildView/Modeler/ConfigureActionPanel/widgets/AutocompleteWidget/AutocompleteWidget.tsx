import React, { FC, useState } from 'react';

import { Popper, PopperProps, TextField, Autocomplete } from '@mui/material';

import { AutocompleteWidgetProps } from './AutocompleteWidget.types';

const AutocompleteWidget: FC<AutocompleteWidgetProps> = (props) => {
    const { customErrors, rawErrors, label, required } = props;
    const [open, setOpen] = useState(false);

    const handleInputChange = (event: any, newInputValue: string) => {
        if (event && newInputValue && (newInputValue.startsWith('$') || newInputValue.startsWith('#'))) 
        { setOpen(true); }
        else 
        { setOpen(false); }
        
    };

    const handleOnClose = () => {
        setOpen(false);
    };

    const onChange = (event: any, newValue: any) => {
        props.onChange(newValue || undefined);
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
            value={props.value || ''}
            onChange={onChange}
            onClose={handleOnClose}
            disabled={props.disabled}
            groupBy={props.groupBy}
            onInputChange={handleInputChange}
            options={props.options['ui:options'] as any[]}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    required={required}
                    label={label}
                    onChange={(event) => onChange(event, event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(customErrors) || Boolean(rawErrors)}
                    helperText={customErrors ? customErrors.map((customError) => customError) : null}
                />
            )}
            PopperComponent={(popperProps: PopperProps) => (
                <Popper
                    {...popperProps}
                    placement="top"
                    modifiers={[{ enabled: false }]}
                    // container={PortalShadowRoot}
                />
            )}
        />
    );
};

export default AutocompleteWidget;
