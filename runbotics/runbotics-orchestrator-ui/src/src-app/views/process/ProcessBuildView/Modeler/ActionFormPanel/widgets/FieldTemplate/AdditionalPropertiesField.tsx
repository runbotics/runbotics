import React, { FC, useState } from 'react';

import Remove from '@mui/icons-material/Remove';
import { Button, TextField, Grid } from '@mui/material';
import { utils } from '@rjsf/core';
import dynamic from 'next/dynamic';

import useTranslations from '#src-app/hooks/useTranslations';

import { AdditionalPropertiesFieldProps } from './AdditionalPropertiesField.types';
import { FieldWithTooltipWrapper, InfoTooltip } from '../InfoTooltip/InfoTooltip';


const CustomTextWidget = dynamic(() => import('../CustomTextWidget'), { ssr: false });

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
    const [mainFieldValue, setMainFieldValue] = useState((label !== MAIN_FIELD_PREDEFINED_LABEL ? label : ''));

    const handleMainFieldChange = (event) => {
        setMainFieldValue(event.target.value);
    };

    // If any action schema has property "additionalProperties" then this custom map component "AdditionalPropertiesField" is rendered.
    if (!isAdditional) {
        return <>{children}</>;
    }

    const { mainFieldLabel, mainFieldInfo, subFieldLabel, subFieldInfo } = schema;
    const formProps = children.props.children[0].props.children[0].props;
    const formData = formProps.formData;
    const subFieldValue = (typeof formData === 'string' && formData !== SUB_FIELD_PREDEFINED_LABEL ? formData : '');
    const errorMessage = translate('Process.Details.Modeler.Actions.General.ConsoleLog.ValidationError');
    const isDisabled = disabled || readonly;
    const isRequired = required || Boolean(formProps.schema?.isRequired);
    const isMainFieldErrorDisplayed = isRequired && !mainFieldValue;
    const isSubFieldErrorDisplayed = isRequired && !subFieldValue;

    const handleBlur = ({ target }: React.FocusEvent<HTMLInputElement>) => onKeyChange(target.value);

    return (
        <Grid container key={`${id}-key`} alignItems="center" spacing={3}>
            <Grid item xs={12}>
                <FieldWithTooltipWrapper>
                    <TextField
                        fullWidth
                        required={isRequired}
                        variant="outlined"
                        label={mainFieldLabel ? mainFieldLabel : 'Key'}
                        size="medium"
                        defaultValue={mainFieldValue}
                        disabled={isDisabled}
                        id={`${id}-key`}
                        name={`${id}-key`}
                        onBlur={!readonly ? handleBlur : undefined}
                        onChange={handleMainFieldChange}
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        error={isMainFieldErrorDisplayed}
                        helperText={isMainFieldErrorDisplayed ? errorMessage : null}
                    />
                    <InfoTooltip text={mainFieldInfo}/>
                </FieldWithTooltipWrapper>
            </Grid>
            <Grid item xs={12}>
                <FieldWithTooltipWrapper>
                    <CustomTextWidget
                        {...formProps}
                        required={isRequired}
                        customErrors={isSubFieldErrorDisplayed ? [errorMessage] : null}
                        label={subFieldLabel ? subFieldLabel : 'Value'}
                        defaultValue={subFieldValue}
                        value={subFieldValue}
                        disabled={isDisabled}
                        type="text"
                    />
                    <InfoTooltip text={subFieldInfo}/>
                </FieldWithTooltipWrapper>
            </Grid>
            <Grid item>
                <Button color="secondary" disabled={isDisabled} onClick={onDropPropertyClick(label)}>
                    <Remove />
                    {translate('Process.Details.Modeler.Widgets.FieldTemplate.Action.RemoveItem')}
                </Button>
            </Grid>
        </Grid>
    );
};

export default AdditionalPropertiesField;
