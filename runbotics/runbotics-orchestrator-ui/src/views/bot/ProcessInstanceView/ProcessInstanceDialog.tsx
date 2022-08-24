import React, { FC, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import { processInstanceActions, processInstanceSelector } from 'src/store/slices/ProcessInstance';
import useTranslations from 'src/hooks/useTranslations';
import Header from './Header';
import Results from './Results';

type ProcessInstanceDialogProps = {
    processInstanceId: string;
    show: boolean;
    onClose: () => void;
};

const ProcessInstanceDialog: FC<ProcessInstanceDialogProps> = ({ show, onClose, processInstanceId }) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const processInstances = useSelector(processInstanceSelector);
    const processInstance = processInstances.all.byId[processInstanceId];

    useEffect(() => {
        dispatch(processInstanceActions.getProcessInstance({ processInstanceId }));
    }, [processInstanceId]);

    return (
        <Dialog open={show} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>{translate('Process.ProcessInstanceView.Dialog.Title')}</DialogTitle>
            <DialogContent>
                {!processInstance && <LinearProgress />}
                {processInstance && (
                    <>
                        <Header processInstance={processInstance} />
                        <Results processInstance={processInstance} />
                    </>
                )}
            </DialogContent>
            <DialogActions />
        </Dialog>
    );
};

export default ProcessInstanceDialog;
