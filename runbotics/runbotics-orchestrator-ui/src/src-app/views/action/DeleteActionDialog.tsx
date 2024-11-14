import React, { FC } from 'react';

import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { activityActions } from '#src-app/store/slices/Action';
import { IAction } from '#src-app/types/model/action.model';

type DeleteActionDialogProps = {
    open?: boolean;
    action: IAction;
    onClose: () => void;
    onDelete: (action: IAction) => void;
};

const DeleteActionDialog: FC<DeleteActionDialogProps> = (props) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();

    const handleSubmit = () => {
        dispatch(activityActions.deleteAction({ resourceId: props.action.id }))
            .unwrap()
            .then(() => {
                props.onDelete(props.action);
                dispatch(activityActions.getAllActions());
            });
    };

    return (
        <>
            <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="lg">
                <DialogTitle>
                    {translate('Action.DeleteAction.Dialog.Title', { script: props.action.script })}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {
                            translate(
                                'Action.DeleteAction.Dialog.ConfirmationMessage',
                                { actionName: props.action.label },
                            )
                        }
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => {
                            props.onClose();
                        }}
                    >
                        {translate('Common.Cancel')}
                    </Button>
                    <Button variant="contained" color="primary" autoFocus onClick={handleSubmit}>
                        {translate('Common.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteActionDialog;
