import React, { FC, useEffect, useState } from 'react';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    LinearProgress,
    Typography
} from '@mui/material';
import {
    FormProps,
    IChangeEvent,
    ISubmitEvent,
    UiSchema,
    withTheme
} from '@rjsf/core';
import { Theme5 as Mui5Theme } from '@rjsf/material-ui';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';

import ErrorBoundary from '#src-app/components/utils/ErrorBoundary';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import {
    saveAction,
    setShowEditModal
} from '#src-app/store/slices/Action/Action.thunks';
import { IAction } from '#src-app/types/model/action.model';
import JSONSchemaFormRenderer from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/renderers/JSONSchemaFormRenderer';
import customWidgets from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets';

import useActionDetailsSchema from './useActionDetailsSchema';

const Form = withTheme<any>(Mui5Theme) as FC<FormProps<any> & { ref: any }>;

const uiSchema: UiSchema = {
    form: {
        'ui:widget': 'EditorWidget',
        'ui:options': {
            language: 'json'
        }
    }
};

export const Index = () => {
    const dispatch = useDispatch();
    const ref = React.useRef<any>();
    const submitFormRef = React.useRef<any>();
    const [draft, setDraft] = useState<any>({});
    const [live, setLive] = useState<any>();
    const [loading, setLoading] = useState(false);
    const showEditModal = useSelector(state => state.action.showEditModal);
    const { enqueueSnackbar } = useSnackbar();
    const schema = useActionDetailsSchema();

    const draftState = useSelector(state => state.action.draft);
    const { translate } = useTranslations();

    useEffect(() => {
        setDraft(draftState.action);
    }, [draftState.action]);

    useEffect(() => {
        setLoading(true);
        const handler = setTimeout(() => {
            setLive({
                id: uuidv4(),
                definition: JSON.parse(draft.form)
            });

            setLoading(false);
        }, 1500);
        return () => {
            clearTimeout(handler);
        };
    }, [draft.form]);

    const handleSubmit = (e: ISubmitEvent<IAction>) => {
        if (!e.formData.script.startsWith('external.')) {
            enqueueSnackbar(translate('Action.Details.ExternalScript.Error'), {
                variant: 'error'
            });
        } else {
            dispatch(saveAction(e.formData));
            dispatch(setShowEditModal({ show: false }));
        }
    };

    const handleChange = (e: IChangeEvent<IAction>) => {
        setDraft(e.formData);
    };

    return (
        <>
            <Dialog
                open={showEditModal}
                onClose={() => {}}
                fullWidth
                maxWidth="xl">
                <DialogTitle>
                    {translate('Action.Details.Dialog.SaveAction', {
                        script: draft.script
                    })}
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={8}>
                            <Form
                                liveValidate
                                ref={ref}
                                schema={schema}
                                widgets={customWidgets}
                                uiSchema={uiSchema}
                                formData={draft}
                                onChange={handleChange}
                                onSubmit={handleSubmit}>
                                <Button
                                    ref={submitFormRef}
                                    type="submit"
                                    style={{ display: 'none' }}
                                />
                            </Form>
                        </Grid>
                        <Grid item xs={4}>
                            <Box px={2} pt={1}>
                                <Typography variant="h4" gutterBottom>
                                    {translate(
                                        'Action.Details.Dialog.LiveView'
                                    )}
                                </Typography>
                            </Box>
                            {loading && <LinearProgress />}

                            {live && live.id && (
                                <ErrorBoundary key={live.id}>
                                    <JSONSchemaFormRenderer
                                        id={live.id}
                                        schema={live.definition.schema}
                                        uiSchema={live.definition.uiSchema}
                                        formData={live.definition.formData}
                                        widgets={customWidgets}
                                    />
                                </ErrorBoundary>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => {
                            dispatch(setShowEditModal({ show: false }));
                        }}>
                        {translate('Common.Cancel')}
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        variant="contained"
                        color="primary"
                        autoFocus
                        onClick={() => {
                            submitFormRef.current.click();
                        }}>
                        {translate('Common.Save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Index;
