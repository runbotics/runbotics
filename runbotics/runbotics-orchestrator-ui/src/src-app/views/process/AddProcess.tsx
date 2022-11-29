/* eslint-disable @typescript-eslint/no-shadow */
import React, { FC, useEffect, useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, SvgIcon, Button, TextField, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { PlusCircle as PlusIcon } from 'react-feather';
import { IProcess } from 'runbotics-common';

import useTranslations, { translate } from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { ProcessTab } from '#src-app/utils/process-tab';

import emptyBpmn from './ProcessBuildView/Modeler/empty.bpmn';

enum InputErrorType {
    NAME_NOT_AVAILABLE = 'NAME_NOT_AVAILABLE',
    REQUIRED = 'REQUIRED',
}

const inputErrorMessages: Record<InputErrorType, string> = {
    [InputErrorType.NAME_NOT_AVAILABLE]: translate('Process.Add.Form.Error.NameNotAvailable'),
    [InputErrorType.REQUIRED]: translate('Process.Add.Form.Error.Required'),
};

const defaultProcessInfo: IProcess = {
    isPublic: false,
    name: '',
    description: '',
    definition: emptyBpmn,
};

type AddProcessDialogProps = {
    open?: boolean;
    onClose: () => void;
    onAdd: (process: IProcess) => void;
};

const AddProcessDialog: FC<AddProcessDialogProps> = ({ open, onClose, onAdd }) => {
    const [name, setName] = useState<string | null>(null);
    const [inputErrorType, setInputErrorType] = useState<InputErrorType | null>(null);
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async () => {
        if (!name) {
            setInputErrorType(InputErrorType.REQUIRED);
            return;
        }

        const isAvailable = await dispatch(processActions.isProcessAvailable({ processName: name }));
        if (isAvailable.meta.requestStatus === 'rejected') {
            setInputErrorType(InputErrorType.NAME_NOT_AVAILABLE);
            return;
        }

        setInputErrorType(null);

        try {
            const processInfo: IProcess = { ...defaultProcessInfo, name };
            const result = await dispatch(processActions.createProcess(processInfo));
            onAdd(result.payload);
        } catch (e) {
            enqueueSnackbar(translate('Process.Add.Form.Error.General'), { variant: 'error' });
        }
    };

    useEffect(() => {
        if (open) setName(null);
    }, [open]);

    useEffect(() => {
        setInputErrorType(null);
    }, [name]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>{translate('Process.Add.Title')}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1, pb: 3 }}>
                    <TextField
                        label={translate('Process.Add.Form.Fields.Name')}
                        error={inputErrorType !== null}
                        helperText={inputErrorMessages[inputErrorType]}
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>
                    {translate('Common.Cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    autoFocus
                    onClick={handleSubmit}
                    aria-label={translate('Common.Submit')}
                >
                    {translate('Common.Save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const AddProcess = () => {
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();
    const { translate } = useTranslations();

    const handleAdd = (process: IProcess) => {
        router.push(`/app/processes/${process.id}/${ProcessTab.BUILD}`);
    };

    return (
        <>
            <Button
                color="primary"
                variant="contained"
                onClick={() => setShowDialog(true)}
                startIcon={
                    <SvgIcon fontSize="small">
                        <PlusIcon />
                    </SvgIcon>
                }
            >
                {translate('Process.Add.ActionName')}
            </Button>
            <AddProcessDialog open={showDialog} onClose={() => setShowDialog(false)} onAdd={handleAdd} />
        </>
    );
};

export default AddProcess;
