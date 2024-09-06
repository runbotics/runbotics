import React, { ChangeEvent, useEffect, useState } from 'react';

import Editor from '@monaco-editor/react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    LinearProgress,
    TextField,
    Typography
} from '@mui/material';

import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';

import ErrorBoundary from '#src-app/components/utils/ErrorBoundary';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { activityActions } from '#src-app/store/slices/Action';
import {
    setShowEditModal
} from '#src-app/store/slices/Action/Action.thunks';
import { IAction } from '#src-app/types/model/action.model';
import JSONSchemaFormRenderer from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/renderers/JSONSchemaFormRenderer';
import customWidgets from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets';

export function isValidJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// eslint-disable-next-line max-lines-per-function
export const Index = () => {
    const dispatch = useDispatch();
    const [draft, setDraft] = useState<IAction>({});
    const [live, setLive] = useState<any>();
    const [loading, setLoading] = useState(false);
    const showEditModal = useSelector(state => state.action.showEditModal);
    const { enqueueSnackbar } = useSnackbar();
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
        }, 1000);
        return () => {
            clearTimeout(handler);
        };
    }, [draft.form]);

    const handleSubmit = () => {
        if (!draft.script.startsWith('external.')) {
            enqueueSnackbar(translate('Action.Details.ExternalScript.Error'), {
                variant: 'error'
            });
            return;
        }

        if (draft.id) {
            dispatch(activityActions.updateAction({ payload: draft, resourceId: draft.id }))
                .unwrap()
                .then(() => {
                    dispatch(activityActions.getAllActions());
                });
            dispatch(setShowEditModal({ show: false }));
        } else {
            dispatch(activityActions.createAction({ payload: { ...draft, id: draft.script } }))
                .unwrap()
                .then(() => {
                    dispatch(activityActions.getAllActions());
                });
            dispatch(setShowEditModal({ show: false }));
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDraft(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleEditorChange = (value: string) => {
        if(!isValidJson(value)) {
            setLoading(true);
            return;
        };
        setDraft((prev) => ({
            ...prev,
            form: value
        }));
        setLoading(false);
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
                            <form onSubmit={handleSubmit}>
                                <TextField fullWidth label={translate('Action.Details.Script')}
                                    name="script"
                                    sx={{margin: (theme) => `${theme.spacing(1)} 0`}}
                                    value={draft.script}
                                    onChange={handleChange}
                                />
                                <TextField fullWidth label={translate('Action.Details.Label')}
                                    name="label"
                                    sx={{margin: (theme) => `${theme.spacing(1)} 0 ${theme.spacing(2)} 0`}}
                                    value={draft.label}
                                    onChange={handleChange}

                                />
                                <ErrorBoundary>
                                    <Editor
                                        height="60vh"
                                        defaultLanguage="json"
                                        value={draft.form}
                                        onChange={handleEditorChange}
                                    />
                                </ErrorBoundary>
                            </form>
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
                        onClick={handleSubmit}>
                        {translate('Common.Save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Index;
