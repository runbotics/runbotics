import React, { useEffect, useState } from 'react';

import { FieldTemplateProps } from '@rjsf/core';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { checkIfKeyExists, translate } from 'src/hooks/useTranslations';
import { capitalizeFirstLetter } from 'src/utils/text';

import WrapIfAdditional from './WrapIfAdditional';

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
            if (
                checkIfKeyExists(
                    'Process.BuildView.Modeler.Widgets.FieldTemplate.' + capitalizeFirstLetter({ text: rawDescription, lowerCaseRest: true })
                )
            ) {
                {/*@ts-ignore*/}
                setDescription(translate(`Process.BuildView.Modeler.Widgets.FieldTemplate.${capitalizeFirstLetter({ text: rawDescription, lowerCaseRest: true })}`));
            }
        }

        if (rawErrors.length > 0) {
            const localRawErrors = [];

            rawErrors.forEach((rawError) => {
                if (
                    checkIfKeyExists('Process.BuildView.Modeler.Widgets.FieldTemplate.' + capitalizeFirstLetter({ text: rawError, lowerCaseRest: true }))
                ) {
                    {/*@ts-ignore*/}
                    localRawErrors.push(translate(`Process.BuildView.Modeler.Widgets.FieldTemplate.${capitalizeFirstLetter({ text: rawError, lowerCaseRest: true })}`));
                } else {
                    localRawErrors.push(rawError);
                }
            });

            setErrors(localRawErrors);
        }
    }, [rawDescription, rawErrors]);

    return (
        <WrapIfAdditional
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
        </WrapIfAdditional>
    );
};

export default FieldTemplate;
