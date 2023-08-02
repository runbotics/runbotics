import React, { FC, useMemo, useState } from 'react';

import { AutocompleteRenderInputParams, TextField } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

import { Options } from '#src-app/hooks/useOptions';

import useTranslations from '#src-app/hooks/useTranslations';

import { BPMNElement } from '../../../helpers/elementParameters';

interface BasicTextFieldProps extends WidgetProps {
    params?: AutocompleteRenderInputParams;
    customErrors?: string[];
    options: Options;
    formContext: {
        selectedElement: BPMNElement;
    }
}

const BasicTextField: FC<BasicTextFieldProps> = ({
    params = {},
    onChange,
    options,
    formContext: { selectedElement },
    ...props
}) => {
    const [errors, setErrors] = useState(props.customErrors);
    const variables = useMemo(() => Object.values(options), [options]);
    const { translate } = useTranslations();

    const validateVariableName = (value: string) => {
        const variable = variables.find(({name}) => name === value);
        (variable && !(variable?.actionId && variable?.actionId === selectedElement.id))
            ? setErrors([translate('Process.BuildView.Modeler.Widgets.VariableNameIsTaken')])
            : setErrors(props.customErrors);
    };

    const handleChange = (newValue: string) => {
        onChange(newValue || undefined);
        validateVariableName(newValue);
    };    
    
    return (
        <TextField
            {...params}
            value={props.value || ''}
            fullWidth
            variant="outlined"
            required={props.required}
            label={props.label}
            onChange={(event) => handleChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors) || Boolean(props.rawErrors)}
            helperText={errors ? errors : null}
        />
    );
};

export default BasicTextField;
