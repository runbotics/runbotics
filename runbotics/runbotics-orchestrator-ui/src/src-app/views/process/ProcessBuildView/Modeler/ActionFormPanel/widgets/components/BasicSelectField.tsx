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
        enumOptions?: {
            label: string | number,
            value: string | number,
        }[];
    };
    customErrors?: string[];
    formContext: {
        selectedElement: BPMNElement;
    } | undefined;
}

const BasicSelectField: FC<BasicSelectFieldProps> = ({
    params = {},
    onChange,
    formContext,
    value,
    options: {
        enumOptions = [],
    },
    ...props
}) => {
    const selectedElement = formContext?.selectedElement;
    const { customValidationErrors } = useSelector(
        (state) => state.process.modeler
    );
    const errors = props.customErrors;

    const isFieldDisabled = useMemo(() => {
        if (customValidationErrors.length > 0 && selectedElement) {
            const erroredElement = customValidationErrors.find(
                (error) => error.elementId !== selectedElement.id
            );
            return Boolean(erroredElement);
        }
        return false;
    }, [selectedElement, customValidationErrors]);

    const options = useMemo(() => enumOptions
        .filter(option => {
            if (typeof option.value !== 'string' && typeof option.value !== 'number') {
                // eslint-disable-next-line no-console
                console.warn(`Any non string or number value is not supported as enum key; Got: ${option} TYPE: ${typeof option}`);
                return false;
            }

            return true;
        }), [enumOptions]
    );
    return (
        <TooltipTextFieldWrapper>
            <TextField
                {...params}
                value={value}
                fullWidth
                variant="outlined"
                disabled={isFieldDisabled}
                required={props.required}
                label={props.label}
                select
                onChange={(event) => onChange(event.target.value)}
                error={Boolean(errors) || Boolean(props.rawErrors)}
            >
                {options.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
            </TextField>
            <If condition={Boolean(props.options?.info)}>
                <InfoButtonTooltip message={props.options?.info} />
            </If>
        </TooltipTextFieldWrapper>
    );
};

export default BasicSelectField;
