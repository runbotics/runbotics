import React, { FC, useMemo } from 'react';

import { AutocompleteRenderInputParams, MenuItem, TextField } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

import If from '#src-app/components/utils/If';

import { useSelector } from '#src-app/store';

import { TooltipTextFieldWrapper } from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip.styles';

import { BPMNElement } from '../../../helpers/elementParameters';
import InfoButtonTooltip from '../InfoTooltip/InfoButtonTooltip';

interface BasicSelectFieldProps extends WidgetProps {
    params?: AutocompleteRenderInputParams;
    options: {
        info?: string;
    };
    customErrors?: string[];
    formContext: {
        selectedElement: BPMNElement;
    };
}

const BasicSelectField: FC<BasicSelectFieldProps> = ({
    params = {},
    onChange,
    formContext: { selectedElement },
    ...props
}) => {
    const { customValidationErrors } = useSelector(
        (state) => state.process.modeler
    );
    const currentValue = props.value || '';
    const errors = props.customErrors;

    const isFieldDisabled = useMemo(() => {
        if (customValidationErrors.length > 0) {
            const erroredElement = customValidationErrors.find(
                (error) => error.elementId !== selectedElement.id
            );
            return Boolean(erroredElement);
        }
        return false;
    }, [selectedElement, customValidationErrors]);

    const handleChange = (newValue: string | undefined) => {
        onChange(newValue || undefined);
    };

    const choices = useMemo(() => (props.schema.enum ?? [])
        .filter(choice => {
            if (typeof choice !== 'string' && typeof choice !== 'number') {
                // eslint-disable-next-line no-console
                console.warn(`Any non string or number value is not supported as enum key; Got: ${choice} TYPE: ${typeof choice}`);
                return false;
            }

            return true;
        })
        .map(choice => choice.toString()), [props.schema.enum]
    );

    return (
        <TooltipTextFieldWrapper>
            <TextField
                {...params}
                value={currentValue}
                fullWidth
                variant="outlined"
                disabled={isFieldDisabled}
                required={props.required}
                label={props.label}
                select
                onChange={(event) => handleChange(event.target.value)}
                error={Boolean(errors) || Boolean(props.rawErrors)}
            >
                {choices.map(choice => <MenuItem key={choice} value={choice}>{choice}</MenuItem>)}
            </TextField>
            <If condition={Boolean(props.options?.info)}>
                <InfoButtonTooltip message={props.options?.info} />
            </If>
        </TooltipTextFieldWrapper>
    );
};

export default BasicSelectField;
