import React, { FC } from 'react';
import Axios from 'axios';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from '@mui/material';
import { useDispatch } from 'src/store';
import { IAction } from 'src/types/model/action.model';
import { getActions } from 'src/store/slices/Action/Action.thunks';
import useTranslations from 'src/hooks/useTranslations';

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
