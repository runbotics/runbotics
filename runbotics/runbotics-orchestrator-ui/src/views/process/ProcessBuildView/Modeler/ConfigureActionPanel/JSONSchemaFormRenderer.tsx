import React, {
    FC, ReactNode, FormEvent, useEffect, useState,
} from 'react';
import {
    ErrorListProps, FormProps, IChangeEvent, withTheme,
} from '@rjsf/core';
import { Theme5 as Mui5Theme } from '@rjsf/material-ui';
import {
    Box, Button, Grid, Alert,
} from '@mui/material';
import _ from 'lodash';
import useDebounce from 'src/hooks/useDebounce';
import useTranslations, { translate as t } from 'src/hooks/useTranslations';
import { useSelector } from 'src/store';
import AutocompleteWidget from './widgets/AutocompleteWidget';
import FieldTemplate from './widgets/FieldTemplate';

const Form = withTheme<any>(Mui5Theme) as FC<FormProps<any> & { ref: any }>;

const widgets = {
    Autocomplete: AutocompleteWidget,
};
const DEBOUNCE_TIME = 1000;
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
    const alertMessage = errors.length > 1
        ? t('Process.Details.Modeler.ActionPanel.Form.JSONSchema.Errors.ErrorsList', { errors: errors.length })
        : t('Process.Details.Modeler.ActionPanel.Form.JSONSchema.Errors.Error');

    return <Alert severity="error">{alertMessage}</Alert>;
}

const JSONSchemaFormRenderer: FC<FormPropsExtended> = (props) => {
    const [isFormError, setIsFormError] = useState(false);
    const { translate } = useTranslations();
    const formRefCallback = (node) => {
        if (node) {
            setIsFormError(node.state.errors.length > 0);
        }
    };
    const [appliedFormState, setAppliedFormState] = useState(props.formData);
    const [formState, setFormState] = useState<FormState>({
        id: null,
        formData: null,
    });
    const debouncedForm = useDebounce<FormState>(formState, DEBOUNCE_TIME);
    const isDirty = React.useMemo(
        () => !_.isEqual(formState.formData, appliedFormState),
        [formState, appliedFormState],
    );
    const appliedActivities = useSelector((state) => state.process.modeler.appliedActivites);
    const isNew = !appliedActivities.includes(props.id);

    const handleSubmit = (
        e: any,
        nativeEvent?: FormEvent<HTMLFormElement>,
    ) => {
        setAppliedFormState(formState.formData);
        return (props.onSubmit
            ? props.onSubmit(e, nativeEvent)
            : null);
    };

    useEffect(() => {
        if (formState?.formData && isDirty && !isFormError && !isNew) {
            handleSubmit(formState);
        }
    }, [debouncedForm]);

    useEffect(() => {
        setFormState({
            id: props.id,
            formData: props.formData,
        });
    }, [props.formData, props.id]);

    const handleChange = (e: IChangeEvent<FormData>) => {
        setFormState({ ...formState, formData: e.formData });
    };

    useEffect(() => () => {
        if (formState?.formData && isDirty && !isFormError) {
            handleSubmit(formState);
        }
    }, [formState]);

    return (
        <Grid item xs={12}>
            <Box px={1}>
                <Box display="flex">
                    {props.panel}
                </Box>
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
