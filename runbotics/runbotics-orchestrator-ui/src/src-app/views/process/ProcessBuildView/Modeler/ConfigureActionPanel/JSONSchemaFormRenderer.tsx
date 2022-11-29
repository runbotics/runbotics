import React, { FC, ReactNode, FormEvent, useEffect, useState, useRef } from 'react';

import { Box, Button, Grid, Alert } from '@mui/material';
import { ErrorListProps, FormProps, IChangeEvent, withTheme } from '@rjsf/core';
import { Theme5 as Mui5Theme } from '@rjsf/material-ui';
import _ from 'lodash';

import useDebounce from '#src-app/hooks/useDebounce';
import { translate as t } from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';

import { processActions } from '#src-app/store/slices/Process';

import AutocompleteWidget from './widgets/AutocompleteWidget';
import FieldTemplate from './widgets/FieldTemplate';

const Form = withTheme<any>(Mui5Theme) as FC<FormProps<any> & { ref: any }>;

const widgets = {
    Autocomplete: AutocompleteWidget,
};
interface FormState {
    id: string;
    formData: FormData;
}

interface FormPropsExtended extends FormProps<any> {
    panel?: ReactNode;
    onSubmit?: (e: any, nativeEvent?: FormEvent<HTMLFormElement>) => void;
}

function ErrorListTemplate(props: ErrorListProps) {
    const { errors } = props;
    const alertMessage =
        errors.length > 1
            ? t('Process.Details.Modeler.ActionPanel.Form.JSONSchema.Errors.ErrorsList', { errors: errors.length })
            : t('Process.Details.Modeler.ActionPanel.Form.JSONSchema.Errors.Error');

    return <Alert severity="error">{alertMessage}</Alert>;
}

const DEBOUNCE_TIME = 500;
const initialFormState = {
    id: null,
    formData: null,
};

const JSONSchemaFormRenderer: FC<FormPropsExtended> = (props) => {
    const dispatch = useDispatch();
    const [isFormError, setIsFormError] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formState, setFormState] = useState<FormState>(initialFormState);
    const formRefCallback = (node) => {
        if (node) setIsFormError(node.state.errors.length > 0);
    };
    const isFormDirty = !_.isEqual(formState.formData, props.formData);
    // Reference to the form state used in component cleanup
    const formValueRef = useRef<FormState>(initialFormState);
    const isFormDirtyRef = useRef(isFormDirty);
    const editModeRef = useRef(editMode);
    const debouncedForm = useDebounce<FormState>(formState, DEBOUNCE_TIME);

    const handleSubmit = (e: any, nativeEvent?: FormEvent<HTMLFormElement>) => {
        setEditMode(false);
        return props.onSubmit ? props.onSubmit(e, nativeEvent) : null;
    };
    
    const handleChange = (e: IChangeEvent<FormData>) => {
        setEditMode(true);
        setFormState({ ...formState, formData: e.formData });
        if (!editMode) { 
            dispatch(processActions.removeAppliedAction(props.id));
        }
    };
    
    useEffect(() => {
        formValueRef.current = formState;
        isFormDirtyRef.current = isFormDirty;
        editModeRef.current = editMode;
    }, [formState, editMode, isFormDirty]);
    
    useEffect(() => {
        setFormState({
            id: props.id,
            formData: props.formData,
        });
    }, [props.formData, props.id]);

    useEffect(() => {
        if (formState?.formData && isFormDirty && !isFormError) { 
            handleSubmit(formState); 
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedForm]);
    useEffect(
        () => () => {
            if (isFormDirtyRef.current && editModeRef.current) {
                handleSubmit(formValueRef.current);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    return (
        <Grid item xs={12}>
            <Box px={1}>
                <Box display="flex">{props.panel}</Box>
                <Box p={1}>
                    {formState.id === props.id && (
                        <Form
                            ref={formRefCallback}
                            {...props}
                            onSubmit={handleSubmit}
                            ErrorList={ErrorListTemplate}
                            noHtml5Validate
                            liveValidate
                            widgets={{ ...widgets, ...props.widgets }}
                            formData={formState.formData}
                            onChange={handleChange}
                            FieldTemplate={FieldTemplate}
                        >
                            <Button type="submit" style={{ display: 'none' }} />
                        </Form>
                    )}
                </Box>
            </Box>
        </Grid>
    );
};

export default JSONSchemaFormRenderer;
