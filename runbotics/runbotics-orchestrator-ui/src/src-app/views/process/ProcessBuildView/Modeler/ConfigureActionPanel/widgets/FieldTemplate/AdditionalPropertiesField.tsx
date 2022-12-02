import React, { FC } from 'react';

import Remove from '@mui/icons-material/Remove';
import { Button, TextField, Grid } from '@mui/material';
import { utils } from '@rjsf/core';
import dynamic from 'next/dynamic';

import useTranslations from '#src-app/hooks/useTranslations';

import { AdditionalPropertiesFieldProps } from './AdditionalPropertiesField.types';


const ElementAwareAutocompleteWidget = dynamic(() => import('../ElementAwareAutocompleteWidget'), { ssr: false });

const { ADDITIONAL_PROPERTY_FLAG } = utils;
const MAIN_FIELD_PREDEFINED_LABEL = 'newKey';
const SUB_FIELD_PREDEFINED_LABEL = 'New Value';

const AdditionalPropertiesField: FC<AdditionalPropertiesFieldProps> = ({
    children,
    disabled,
    id,
    label,
    onDropPropertyClick,
    onKeyChange,
    readonly,
    required,
    schema,
}) => {
    const { translate } = useTranslations();
    const isAdditional = schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);

    if (!isAdditional) {
        return <>{children}</>;
    };

    const { mainFieldLabel, subFieldLabel } = schema;
    const formProps = children.props.children[0].props.children[0].props;
    const formData = formProps.formData;
    const mainFieldValue = (label !== MAIN_FIELD_PREDEFINED_LABEL ? label : '');
    const subFieldValue = (typeof formData === 'string' && formData !== SUB_FIELD_PREDEFINED_LABEL ? formData : '');

    const handleBlur = ({ target }: React.FocusEvent<HTMLInputElement>) => onKeyChange(target.value);
    
    return (
        <Grid container key={`${id}-key`} alignItems="center" spacing={1}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    required={required}
                    variant="outlined"
                    label={mainFieldLabel ? mainFieldLabel : 'Key'}
                    size="medium"
                    defaultValue={mainFieldValue}
                    disabled={disabled || readonly}
                    id={`${id}-key`}
                    name={`${id}-key`}
                    onBlur={!readonly ? handleBlur : undefined}
                    type="text"
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12}>
                <ElementAwareAutocompleteWidget
                    {...formProps}
                    required={required}
                    label={subFieldLabel ? subFieldLabel : 'Value'}
                    defaultValue={subFieldValue}
                    value={subFieldValue}
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
