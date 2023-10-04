import React, { FC, useEffect, useMemo, useState } from 'react';

import { AutocompleteRenderInputParams, TextField } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

import useCustomValidation from '#src-app/hooks/useCustomValidation';
import useDebounce from '#src-app/hooks/useDebounce';
import { Variable } from '#src-app/hooks/useOptions';

import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';

import { BPMNElement } from '../../../helpers/elementParameters';
import {
    FieldWithTooltipWrapper, InfoTooltip
} from "#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoTooltip";

interface BasicTextFieldProps extends WidgetProps {
    params?: AutocompleteRenderInputParams;
    options: {
        info?: string;
    };
    customErrors?: string[];
    variables: Variable[];
    formContext: {
        selectedElement: BPMNElement;
    }
}

const DEBOUNCE_TIME = 600;

const BasicTextField: FC<BasicTextFieldProps> = ({
    params = {},
    onChange,
    variables,
    formContext: { selectedElement },
    ...props
}) => {
    const { customValidationErrors } = useSelector((state) => state.process.modeler);
    const [currentValue, setCurrentValue] = useState(props.value || '');
    const debouncedValue = useDebounce<string>(currentValue, DEBOUNCE_TIME);
    const { validator } = useCustomValidation();
    const [errors, setErrors] = useState(props.customErrors);
    const { translate } = useTranslations();

    const isFieldDisabled = useMemo(() => {
        if (customValidationErrors.length > 0) {
            const erroredElement = customValidationErrors.find(error => error.elementId !== selectedElement.id);
            return Boolean(erroredElement);
        }
        return false;
    }, [selectedElement, customValidationErrors]);

    const validateVariableName = (value: string) => {
        const variable = variables.find(({ name }) => name === value);
        return !(variable && !(variable?.actionId && variable?.actionId === selectedElement.id));
    };

    const handleChange = (newValue: string | undefined) => {
        onChange(newValue || undefined);
        setCurrentValue(newValue);
    };

    useEffect(() => {
        const isValid = validator(() => validateVariableName(currentValue));
        isValid
            ? setErrors(props.customErrors)
            : setErrors([translate('Process.BuildView.Modeler.Widgets.VariableNameIsTaken')]);
    }, [debouncedValue]);

    return (
        <FieldWithTooltipWrapper>
            <TextField
                {...params}
                value={currentValue}
                fullWidth
                variant="outlined"
                disabled={isFieldDisabled}
                required={props.required}
                label={props.label}
                onChange={(event) => handleChange(event.target.value)}
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors) || Boolean(props.rawErrors)}
                helperText={errors ? errors : null}
            />
            <InfoTooltip text={props.options?.info}/>
        </FieldWithTooltipWrapper>
    );
};

export default BasicTextField;
