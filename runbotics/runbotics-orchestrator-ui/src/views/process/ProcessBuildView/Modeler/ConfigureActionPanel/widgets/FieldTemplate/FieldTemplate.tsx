import React from 'react';

import { FieldTemplateProps } from '@rjsf/core';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

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
}: FieldTemplateProps) => (
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
                    {rawDescription}
                </Typography>
            ) : null}
            {rawErrors.length > 0 && (
                <List dense disablePadding>
                    {rawErrors.map((error) => (
                            <ListItem key={error} disableGutters>
                                <FormHelperText id={id}>{error}</FormHelperText>
                            </ListItem>
                    ))}
                </List>
            )}
            {rawHelp && <FormHelperText id={id}>{rawHelp}</FormHelperText>}
        </FormControl>
    </WrapIfAdditional>
);

export default FieldTemplate;
