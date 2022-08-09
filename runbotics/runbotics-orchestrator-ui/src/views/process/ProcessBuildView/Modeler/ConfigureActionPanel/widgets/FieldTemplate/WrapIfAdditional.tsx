import React from 'react';
import { utils } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';
import Grid from '@mui/material/Grid';
import { Button, TextField } from '@mui/material';
import Remove from '@mui/icons-material/Remove';
import useTranslations from 'src/hooks/useTranslations';

const { ADDITIONAL_PROPERTY_FLAG } = utils;

type WrapIfAdditionalProps = {
    children: React.ReactElement;
    // eslint-disable-next-line react/no-unused-prop-types
    classNames: string;
    disabled: boolean;
    id: string;
    label: string;
    onDropPropertyClick: (index: string) => (event?: any) => void;
    onKeyChange: (index: string) => (event?: any) => void;
    readonly: boolean;
    required: boolean;
    schema: JSONSchema7;
};

const WrapIfAdditional = ({
    children,
    disabled,
    id,
    label,
    onDropPropertyClick,
    onKeyChange,
    readonly,
    required,
    schema,
}: WrapIfAdditionalProps) => {
    const additional = schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);
    const { translate } = useTranslations();

    if (!additional) {
        return <>{children}</>;
    }

    const handleBlur = ({ target }: React.FocusEvent<HTMLInputElement>) => onKeyChange(target.value);

    return (
        <Grid container key={`${id}-key`} alignItems="center" spacing={1}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    required={required}
                    variant="outlined"
                    label="key"
                    size="small"
                    defaultValue={label}
                    disabled={disabled || readonly}
                    id={`${id}-key`}
                    name={`${id}-key`}
                    onBlur={!readonly ? handleBlur : undefined}
                    type="text"
                />
            </Grid>
            <Grid item xs={12}>
                {children}
            </Grid>
            <Grid item>
                <Button color="secondary" disabled={disabled || readonly} onClick={onDropPropertyClick(label)}>
                    <Remove />
                        {' '}
                        {translate('Process.Details.Modeler.Widgets.FieldTemplate.Action.RemoveItem')}
                </Button>
            </Grid>
        </Grid>
    );
};

export default WrapIfAdditional;
