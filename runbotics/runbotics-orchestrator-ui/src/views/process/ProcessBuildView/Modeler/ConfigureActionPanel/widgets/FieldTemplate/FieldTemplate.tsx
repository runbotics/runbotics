import React, { useEffect, useState } from 'react';


import { FormControl, FormHelperText, List, ListItem, Typography } from '@mui/material';
import { FieldTemplateProps } from '@rjsf/core';
import i18n from 'i18next';

import { checkIfKeyExists, translate } from 'src/hooks/useTranslations';
import { capitalizeFirstLetter } from 'src/utils/text';

import AdditionalPropertiesField from './AdditionalPropertiesField';


const FieldTemplate = ({
    id,
    children,
    classNames,
    disabled,
    displayLabel,
    label,
    onDropPropertyClick,
    onKeyChange,
    readonly,
    required,
    rawErrors = [],
    rawHelp,
    rawDescription,
    schema,
}: FieldTemplateProps) => {
    const [description, setDescription] = useState(rawDescription);
    const [errors, setErrors] = useState(rawErrors);

    useEffect(() => {
        if (typeof rawDescription !== 'undefined') {
            const translateKey = 'Process.BuildView.Modeler.Widgets.FieldTemplate.' + capitalizeFirstLetter({ text: rawDescription, delimiter: ' ', lowerCaseRest: true });
            if (checkIfKeyExists(translateKey)) {
                { /*@ts-ignore*/ }
                setDescription(translate(translateKey));
            }
        };

        if (rawErrors.length > 0) {
            const localRawErrors = [];
            
            rawErrors.forEach((rawError) => {
                const translateKey = `Process.BuildView.Modeler.Widgets.FieldTemplate.${capitalizeFirstLetter({ text: rawError.replace(/".*"/g, ''), delimiter: ' ', lowerCaseRest: true })}`;
                if (checkIfKeyExists(translateKey)) {
                    { /*@ts-ignore*/ }
                    localRawErrors.push(translate(translateKey));
                } else {
                    localRawErrors.push(rawError);
                }
            });

            setErrors(localRawErrors);
        }
    }, [rawDescription, rawErrors, i18n.language]);

    return (
        <AdditionalPropertiesField
            classNames={classNames}
            disabled={disabled}
            id={id}
            label={label}
            onDropPropertyClick={onDropPropertyClick}
            onKeyChange={onKeyChange}
            readonly={readonly}
            required={required}
            schema={schema}
        >
            <FormControl fullWidth error={!!rawErrors.length} required={required}>
                {children}
                {displayLabel && rawDescription ? (
                    <Typography variant="caption" color="textSecondary">
                        {description}
                    </Typography>
                ) : null}
                {rawErrors.length > 0 && (
                    <List dense disablePadding>
                        {errors.map((error) => (
                            <ListItem key={rawErrors[errors.indexOf(error)]} disableGutters>
                                <FormHelperText id={id}>{error}</FormHelperText>
                            </ListItem>
                        ))}
                    </List>
                )}
                {rawHelp && <FormHelperText id={id}>{rawHelp}</FormHelperText>}
            </FormControl>
        </AdditionalPropertiesField>
    );
};

export default FieldTemplate;
