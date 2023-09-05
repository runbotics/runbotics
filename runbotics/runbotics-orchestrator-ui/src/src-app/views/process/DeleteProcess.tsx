import React, { VFC, useState, useContext, FC } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    MenuItem,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { IProcess } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { ProcessPageContext } from '#src-app/providers/ProcessPage.provider';
import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

type DeleteProcessDialogProps = {
    open?: boolean;
    process: IProcess;
    onClose: () => void;
    onDelete: (process: IProcess) => void;
};

const DeleteProcessDialog: VFC<DeleteProcessDialogProps> = (props) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { page, pageSize, search } = useContext(ProcessPageContext);
    const { translate } = useTranslations();

    const handleSubmit = async () => {
        await dispatch(processActions.deleteProcess({ processId: props.process.id }));
        props.onDelete(props.process);
        dispatch(processActions.getProcessesPage({
            page,
            size: pageSize,
            filter: {
                contains: { ...(search.trim() && { name: search.trim() }) },
            },
        }));
        enqueueSnackbar(translate('Process.Delete.SuccessMessage', { name: props.process.name }), {
            variant: 'success',
        });
    };

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                {translate('Process.Delete.Title', { name: props.process.name })}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    {translate('Process.Delete.ConfirmationQuestion', { name: props.process.name })}
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
                <Button
                    variant="contained"
                    color="primary"
                    autoFocus
                    onClick={handleSubmit}
                >
                    {translate('Common.Confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

type DeleteProcessProps = {
    process: IProcess;
};

const DeleteProcess: FC<DeleteProcessProps> = ({ process }) => {
    const [show, setShow] = useState(false);
    const { translate } = useTranslations();

    const handleDelete = () => {
        setShow(false);
    };

    return (
        <>
            <MenuItem onClick={() => setShow(true)}>{translate('Process.Delete.ActionName')}</MenuItem>
            <DeleteProcessDialog
                process={process}
                open={show}
                onClose={() => setShow(false)}
                onDelete={handleDelete}
            />
        </>
    );
};

export default DeleteProcess;
