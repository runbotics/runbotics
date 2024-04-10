/* eslint-disable @typescript-eslint/no-shadow */
import React, { FC, FormEvent, useEffect, useState } from 'react';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    SvgIcon,
    Button,
    TextField,
    Box
} from '@mui/material';
import { PayloadAction } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FilePlus } from 'react-feather';
import { IProcess } from 'runbotics-common';

import useTranslations, { checkIfKeyExists, translate } from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { ProcessTab } from '#src-app/utils/process-tab';

import { capitalizeFirstLetter } from '#src-app/utils/text';

import emptyBpmn from './ProcessBuildView/Modeler/extensions/config/empty.bpmn';

enum InputErrorType {
    NAME_NOT_AVAILABLE = 'NAME_NOT_AVAILABLE',
    REQUIRED = 'REQUIRED'
}

const inputErrorMessages: Record<InputErrorType, string> = {
    [InputErrorType.NAME_NOT_AVAILABLE]: translate(
        'Process.Add.Form.Error.NameNotAvailable'
    ),
    [InputErrorType.REQUIRED]: translate('Process.Add.Form.Error.Required')
};

const defaultProcessInfo: IProcess = {
    isPublic: false,
    name: '',
    description: '',
    definition: emptyBpmn
};

type AddProcessDialogProps = {
    open?: boolean;
    onClose: () => void;
    onAdd: (process: IProcess) => void;
};

const AddProcessDialog: FC<AddProcessDialogProps> = ({
    open,
    onClose,
    onAdd
}) => {
    const [name, setName] = useState<string | null>(null);
    const [inputErrorType, setInputErrorType] = useState<InputErrorType | null>(
        null
    );
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const isFieldEmpty = Boolean(name?.trim().length === 0);

    const handleClose = () => {
        setName('');
        setInputErrorType(null);
        onClose();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!name || isFieldEmpty) {
            setInputErrorType(InputErrorType.REQUIRED);
            return;
        }

        try {
            const processInfo: IProcess = { ...defaultProcessInfo, name };
            const result: PayloadAction<IProcess> = await dispatch(
                processActions.createProcess(processInfo)
            );

            if ('detail' in result.payload && result.payload?.detail) throw { message: result.payload.detail };

            onAdd(result.payload);
        } catch (error) {
            const message = error?.message ?? translate('Process.Add.Form.Error.General');
            const translationKey = `Process.Add.Form.Error.${capitalizeFirstLetter({ text: error.message, delimiter: ' ' })}`;
            checkIfKeyExists(translationKey)
                ? enqueueSnackbar(
                    translate(translationKey), {
                        variant: 'error'
                    }
                )
                : enqueueSnackbar(
                    message, {
                        variant: 'error'
                    }
                );
        }
    };


    useEffect(() => {
        if (open) setName(null);
        setInputErrorType(null);
    }, [open]);

    useEffect(() => {
        setInputErrorType(null);
    }, [name]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <form onSubmit={handleSubmit} noValidate>
                <DialogTitle>{translate('Process.Add.Title')}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, pb: 3 }}>
                        <TextField
                            label={translate('Process.Add.Form.Fields.Name')}
                            error={inputErrorType !== null}
                            helperText={inputErrorMessages[inputErrorType]}
                            fullWidth
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            autoFocus
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
                        aria-label={translate('Common.Submit')}>
                        {translate('Common.Save')}
                    </Button>
                </DialogActions>
            </form>
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
                        <FilePlus />
                    </SvgIcon>
                }>
                {translate('Process.Add.ActionName')}
            </Button>
            <AddProcessDialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                onAdd={handleAdd}
            />
        </>
    );
};

export default AddProcess;
