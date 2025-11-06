import React, { FC, useState } from 'react';

import Remove from '@mui/icons-material/Remove';
import { Button, TextField, Grid } from '@mui/material';
import { utils } from '@rjsf/core';
import dynamic from 'next/dynamic';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { AdditionalPropertiesFieldProps } from './AdditionalPropertiesField.types';

import InfoButtonTooltip from '../InfoTooltip/InfoButtonTooltip';
import { TooltipTextFieldWrapper } from '../InfoTooltip/InfoButtonTooltip.styles';

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

    const { mainFieldLabel, mainFieldInfo, properties, subFieldLabel, subFieldInfo } = schema;
    const formProps = children.props.children[0].props.children[0].props;
    const formData = formProps.formData;

    console.log('formData', formData);

    const subFieldValue = ( formData !== SUB_FIELD_PREDEFINED_LABEL ? formData : '');
    const errorMessage = translate('Process.Details.Modeler.Actions.General.ConsoleLog.ValidationError');
    const isDisabled = disabled || readonly;
    const isRequired = required || Boolean(formProps.schema?.isRequired);
    const isMainFieldErrorDisplayed = isRequired && !mainFieldValue;
    const isSubFieldErrorDisplayed = isRequired && !subFieldValue;
    const hasNestedProperties = properties && Object.keys(properties).length > 0;


    const handleBlur = ({ target }: React.FocusEvent<HTMLInputElement>) => onKeyChange(target.value);

    return (
        <Grid container key={`${id}-key`} alignItems="center" spacing={3}>
            <Grid item xs={12}>
                <TooltipTextFieldWrapper>
                    <TextField
                        fullWidth
                        required={isRequired}
                        variant="outlined"
                        label={mainFieldLabel ? mainFieldLabel : translate('Process.Details.Modeler.Widgets.FieldTemplate.TextField.Key')}
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
                    <If condition={Boolean(mainFieldInfo)}>
                        <InfoButtonTooltip message={mainFieldInfo}/>
                    </If>
                </TooltipTextFieldWrapper>
            </Grid>
            <Grid item xs={12}>
                {/* <TooltipTextFieldWrapper>
                    <CustomTextWidget
                        {...formProps}
                        required={isRequired}
                        customErrors={isSubFieldErrorDisplayed ? [errorMessage] : null}
                        label={subFieldLabel ? subFieldLabel : translate('Process.Details.Modeler.Widgets.FieldTemplate.TextField.Value')}
                        defaultValue={subFieldValue}
                        value={subFieldValue}
                        disabled={isDisabled}
                        type="text"
                    />
                    <If condition={Boolean(subFieldInfo)}>
                        <InfoButtonTooltip message={subFieldInfo} />
                    </If>
                </TooltipTextFieldWrapper> */}
                {hasNestedProperties && (
                    <Grid item xs={12}>
                        {children}
                    </Grid>
                )}
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
