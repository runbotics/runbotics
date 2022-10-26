import React, { FC, ReactNode, FormEvent, useEffect, useState } from 'react';
import { ErrorListProps, FormProps, IChangeEvent, ISubmitEvent, withTheme } from '@rjsf/core';
import { Theme5 as Mui5Theme } from '@rjsf/material-ui';
import { Box, Button, Grid, Alert } from '@mui/material';
import _ from 'lodash';

const Form = withTheme<any>(Mui5Theme) as FC<FormProps<any> & { ref: any }>;

const ErrorListTemplate = (props: ErrorListProps) => {
    const { errors } = props;
    const alertMessage =
        errors.length > 1
            ? `There are ${errors.length} validation errors`
            : `There is ${errors.length} validation error`;

    return <Alert severity="error">{alertMessage}</Alert>;
};

interface FormPropsExtended extends FormProps<any> {
    panel?: ReactNode;
    submitFormRef?: React.Ref<HTMLButtonElement>;
}

const FormRenderer: FC<FormPropsExtended> = (props) => {
    const [isFormError, setIsFormError] = useState(false);
    const [formState, setFormState] = useState<{ id: string; formData: FormData }>({
        id: undefined,
        formData: undefined,
    });

    const formRefCallback = (node) => {
        if (node) 
            setIsFormError(node.state.errors.length > 0);
        
    };

    const isDirty = React.useMemo(
        () => !_.isEqual(props.formData, formState.formData),
        [props.formData, formState.formData],
    );

    useEffect(() => {
        setFormState({
            id: props.id,
            formData: props.formData,
        });
    }, [props.formData, props.id]);

    const handleChange = (e: IChangeEvent<FormData>) => {
        setFormState({ ...formState, formData: e.formData });
    };

    const handleSubmit = (e: ISubmitEvent<any>, nativeEvent: FormEvent<HTMLFormElement>) => props.onSubmit && !isFormError && isDirty ? props.onSubmit(e, nativeEvent) : null;

    return (
        <Grid item xs={12}>
            <Box p={1}>
                {formState.id === props.id && (
                    <Form
                        liveValidate
                        ref={formRefCallback}
                        {...props}
                        onSubmit={handleSubmit}
                        ErrorList={ErrorListTemplate}
                        noHtml5Validate
                        formData={formState.formData}
                        onChange={handleChange}
                    >
                        <Button ref={props.submitFormRef} type="submit" style={{ display: 'none' }} />
                    </Form>
                )}
            </Box>
        </Grid>
    );
};

export default FormRenderer;
