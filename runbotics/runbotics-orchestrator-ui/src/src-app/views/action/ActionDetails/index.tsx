import React, { ChangeEvent, useEffect, useState } from 'react';

import Editor from '@monaco-editor/react';
import {
    Grid,
    TextField
} from '@mui/material';

import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import ErrorBoundary from '#src-app/components/utils/ErrorBoundary';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { activityActions } from '#src-app/store/slices/Action';
import {
    setShowEditModal
} from '#src-app/store/slices/Action/Action.thunks';
import { IAction } from '#src-app/types/model/action.model';

import { LiveView } from './LiveView';
import { initialFormValidationState, isScriptNameValid, isValueEmpty } from '../action.utils';

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
    const showEditModal = useSelector(state => state.action.showEditModal);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const draftState = useSelector(state => state.action.draft);
    const { translate } = useTranslations();
    const [formValidationState, setFormValidationState] = useState(initialFormValidationState);

    const checkIsFormValid = () => Object.values(formValidationState).every(Boolean);

    useEffect(() => {
        setDraft(draftState.action);
    }, [draftState.action]);

    const handleSubmit = () => {
        if (!draft.script.startsWith('external.')) {
            enqueueSnackbar(translate('Action.Details.ExternalScript.Error'), {
                variant: 'error'
            });
            return;
        }

        if (!checkIsFormValid) {
            enqueueSnackbar(translate('Action.Details.Form.Validation.Error'), {
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

    const handleClose = () => {
        dispatch(setShowEditModal({ show: false }));
        setFormValidationState(initialFormValidationState);
    };

    const handleChange = (field: string, e: ChangeEvent<HTMLInputElement>) => {
        setDraft(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

        if (field === 'script') {
            setFormValidationState(prevState => ({
                ...prevState,
                script: isScriptNameValid(e.target.value)
            }));
        }

        if (field === 'label') {
            setFormValidationState(prevState => ({
                ...prevState,
                label: isValueEmpty(e.target.value)
            }));
        }
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

    const scriptInputErrorProperties = {
        ...!formValidationState.script && {
            error: true,
            helperText: translate('Action.Details.Form.Script.Error'),
        },
    };

    const labelInputErrorProperties = {
        ...(!formValidationState.label && {
            error: true,
            helperText: translate('Action.Details.Form.Label.Error'),
        }),
    };

    return (
        <>
            <CustomDialog
                isOpen={showEditModal}
                onClose={() => {}}
                title={translate('Action.Details.Dialog.SaveAction', {
                    script: draft.script
                })}
                confirmButtonOptions={{
                    label: translate('Common.Save'),
                    onClick: handleSubmit,
                    isDisabled: !checkIsFormValid(),
                }}
                cancelButtonOptions={{
                    label: translate('Common.Cancel'),
                    onClick: handleClose,
                }}
                maxWidth={'xl'}>
                <Grid container>
                    <Grid item xs={8} pr={2}>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label={translate('Action.Details.Script')}
                                name="script"
                                sx={{
                                    margin: (theme) =>
                                        `${theme.spacing(1)} 0`,
                                }}
                                value={draft.script}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('script', e)}
                                autoComplete="off"
                                {...scriptInputErrorProperties}
                            />
                            <TextField
                                fullWidth
                                label={translate('Action.Details.Label')}
                                name="label"
                                required
                                sx={{
                                    margin: (theme) =>
                                        `${theme.spacing(
                                            1
                                        )} 0 ${theme.spacing(5)} 0`,
                                }}
                                value={draft.label}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('label', e)}
                                autoComplete="off"
                                {...labelInputErrorProperties}
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
                        <LiveView
                            draft={draft}
                            loading={loading}
                            setLoading={setLoading}/>
                    </Grid>
                </Grid>
            </CustomDialog>
        </>
    );
};

export default Index;
