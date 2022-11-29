import React, { FC } from 'react';

import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from '@mui/material';
import Axios from 'axios';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { getActions } from '#src-app/store/slices/Action/Action.thunks';
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

    const handleSubmit = async () => {
        await Axios.delete(`/api/actions/${props.action.id}`);
        props.onDelete(props.action);
        dispatch(getActions());
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
