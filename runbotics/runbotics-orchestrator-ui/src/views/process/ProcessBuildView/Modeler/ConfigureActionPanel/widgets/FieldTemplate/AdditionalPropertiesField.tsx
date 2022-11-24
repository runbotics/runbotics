import React from 'react';

import Remove from '@mui/icons-material/Remove';
import { Button, TextField, Grid } from '@mui/material';
import { utils } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';
import dynamic from 'next/dynamic';

import useTranslations from 'src/hooks/useTranslations';

const ElementAwareAutocompleteWidget = dynamic(() => import('../ElementAwareAutocompleteWidget'), { ssr: false });

const { ADDITIONAL_PROPERTY_FLAG } = utils;

type JSONSchema7Titles = JSONSchema7 & { mainTitle?: string, subTitle?: string }; 

type AdditionalPropertiesFieldProps = {
    children: React.ReactElement;
    classNames: string;
    disabled: boolean;
    id: string;
    label: string;
    onDropPropertyClick: (index: string) => (event?: any) => void;
    onKeyChange: (index: string) => (event?: any) => void;
    readonly: boolean;
    required: boolean;
    schema: JSONSchema7Titles;
};

const AdditionalPropertiesField = ({
    children,
    disabled,
    id,
    label,
    onDropPropertyClick,
    onKeyChange,
    readonly,
    required,
    schema,
}: AdditionalPropertiesFieldProps) => {
    const { translate } = useTranslations();
    const isAdditional = schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);
    const{ mainTitle, subTitle } = schema;
    const formData = children.props.children[0].props.children[0].props.formData;

    const handleBlur = ({ target }: React.FocusEvent<HTMLInputElement>) => onKeyChange(target.value);

    if (!isAdditional) {
        return <>{children}</>;
    };

    return (
        <Grid container key={`${id}-key`} alignItems="center" spacing={1}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    required={required}
                    variant="outlined"
                    label={mainTitle ? mainTitle : 'Key'}
                    size="medium"
                    defaultValue={label !== 'newKey' && label !== 'additionalProperties' ? label : ''}
                    disabled={disabled || readonly}
                    id={`${id}-key`}
                    name={`${id}-key`}
                    onBlur={!readonly ? handleBlur : undefined}
                    type="text"
                />
            </Grid>
            <Grid item xs={12}>
                <ElementAwareAutocompleteWidget
                    {...children.props.children[0].props.children[0].props}
                    required={required}
                    label={subTitle ? subTitle : 'Value'}
                    defaultValue={formData !== 'New Value' && typeof formData === 'string' ? formData : ''}
                    value={formData !== 'New Value' && typeof formData === 'string' ? formData : ''}
                    disabled={disabled || readonly}
                    type="text"
                />
            </Grid>
            <Grid item>
                <Button color="secondary" disabled={disabled || readonly} onClick={onDropPropertyClick(label)}>
                    <Remove />
                    {translate('Process.Details.Modeler.Widgets.FieldTemplate.Action.RemoveItem')}
                </Button>
            </Grid>
        </Grid>
    );
};

export default AdditionalPropertiesField;
