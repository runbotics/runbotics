import React, { useMemo } from 'react';
import { IProcess } from 'runbotics-common';
import { useDispatch } from 'src/store';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ISubmitEvent } from '@rjsf/core';
import customWidgets from 'src/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/widgets';
import _ from 'lodash';
import { translate } from 'src/hooks/useTranslations';
import ErrorBoundary from '../utils/ErrorBoundary';
import FormRenderer from './FormRenderer';

interface UserModalProps {
    open: boolean;
    process: IProcess;
    setOpen: (open: boolean) => void;
    onSubmit: (executionInfo: Record<string, any>) => void;
}

function isJsonValid(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const StartupModal: React.FC<UserModalProps> = ({
    open, setOpen, process, onSubmit,
}) => {
    const submitFormRef = React.useRef<any>();
    const processForm = useMemo(() => {
        if (isJsonValid(process?.executionInfo)) {
            return JSON.parse(process.executionInfo);
        }
        null;
    }, [process]);

    const handleSubmit = (e: ISubmitEvent<any>) => {
        onSubmit(e.formData);
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
                {translate('Component.StartupFormModal.StartupModal.Title')} {process.name}
            </DialogTitle>
            <DialogContent>
                <ErrorBoundary key={process.id}>
                    {processForm && (
                        <FormRenderer
                            id={uuidv4()}
                            schema={processForm.schema}
                            uiSchema={processForm.uiSchema}
                            submitFormRef={submitFormRef}
                            formData={processForm.formData}
                            widgets={customWidgets}
                            onSubmit={handleSubmit}
                        />
                    )}
                </ErrorBoundary>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    {translate('Common.Cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    autoFocus
                    onClick={() => {
                        submitFormRef.current.click();
                    }}
                >
                    {translate('Common.Submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StartupModal;
