import React, { FC, useState } from 'react';

import { Popper, PopperProps, TextField, Autocomplete } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

const AutocompleteWidget: FC<WidgetProps & { groupBy?: (option: any) => string } & { customError?: string[] }> = ({customErrors, rawErrors}, props) => {
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
    const label = props.label ? `${props.label} ${props.required ? '*' : ''}` : '';
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
                    label={label}
                    onChange={(event) => onChange(event, event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    error={!!customErrors || !!rawErrors}
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
