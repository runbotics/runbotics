import React, { FC, useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, SvgIcon, Button, TextField, Box,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { PlusCircle as PlusIcon } from 'react-feather';
import { BotSystem, IProcess } from 'runbotics-common';
import { ProcessTab } from 'src/utils/process-tab';
import useTranslations, { translate } from 'src/hooks/useTranslations';
import emptyBpmn from './ProcessBuildView/Modeler/empty.bpmn';
import { useDispatch } from 'src/store';
import { processActions } from 'src/store/slices/Process';

enum ErrorType {
    NAME_NOT_AVAILABLE = 'NAME_NOT_AVAILABLE',
}

const errorMessages: Record<ErrorType, string> = {
    [ErrorType.NAME_NOT_AVAILABLE]: translate('Process.Add.Form.Error.NameNotAvailable'),
};

const defaultProcessInfo: IProcess = {
    isPublic: false,
    name: '',
    description: '',
    definition: emptyBpmn,
}

type AddProcessDialogProps = {
    open?: boolean;
    onClose: () => void;
    onAdd: (process: IProcess) => void;
};

const AddProcessDialog: FC<AddProcessDialogProps> = ({ open, onClose, onAdd }) => {
    const [name, setName] = useState<string | null>(null);
    const [errorType, setErrorType] = useState<ErrorType | null>(null);
    const { translate } = useTranslations();
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        const isAvailable = await dispatch(processActions.isProcessAvailable({ processName: name }));
        if (isAvailable.meta.requestStatus === 'rejected') {
            setErrorType(ErrorType.NAME_NOT_AVAILABLE);
            return;
        }
        setErrorType(null);

        const processInfo: IProcess = { ...defaultProcessInfo, name };
        const result = await dispatch(processActions.createProcess(processInfo));
        
        onAdd(result.payload);
    };

    useEffect(() => {
        if (open) setName(null);
    }, [open]);

    useEffect(() => {
        setErrorType(null);
    }, [name]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>{translate('Process.Add.Title')}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1, pb: 3 }}>
                    <TextField
                        label={translate('Process.Add.Form.Fields.Name')}
                        error={errorType !== null} 
                        helperText={errorMessages[errorType]}
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={onClose}
                >
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
    const history = useHistory();
    const { translate } = useTranslations();

    const handleAdd = (process: IProcess) => {
        history.push(`/app/processes/${process.id}/${ProcessTab.BUILD}`);
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
