import React, { useEffect, useState } from 'react';

import { Grid } from '@mui/material';

import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { activityActions } from '#src-app/store/slices/Action';
import { setShowEditModal } from '#src-app/store/slices/Action/Action.thunks';
import { IAction } from '#src-app/types/model/action.model';

import { CustomEditor } from './CustomEditor';
import { ExternalActionForm } from './ExternalActionForm';
import { LiveView } from './LiveView';
import { initialFormValidationState } from '../action.utils';

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
                    isDisabled: !checkIsFormValid()
                }}
                cancelButtonOptions={{
                    label: translate('Common.Cancel'),
                    onClick: handleClose
                }}
                maxWidth={'xl'}
                fullWidth={true}
            >
                <Grid container>
                    <Grid item xs={8} pr={2}>
                        <ExternalActionForm
                            draft={draft}
                            setDraft={setDraft}
                            formValidationState={formValidationState}
                            setFormValidationState={setFormValidationState}
                        />
                        <CustomEditor setLoading={setLoading} setDraft={setDraft} draftForm={draft.form} />
                    </Grid>
                    <Grid item xs={4}>
                        <LiveView draft={draft} loading={loading} setLoading={setLoading} />
                    </Grid>
                </Grid>
            </CustomDialog>
        </>
    );
};

export default Index;
