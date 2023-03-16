import React, { useMemo } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ISubmitEvent } from '@rjsf/core';
import { IProcess } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';


import customWidgets from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets';

import ErrorBoundary from '../utils/ErrorBoundary';

import FormRenderer from './FormRenderer';

import { isJsonValid } from '#src-app/utils/utils';


interface UserModalProps {
    open: boolean;
    process: IProcess;
    setOpen: (open: boolean) => void;
    onSubmit: (executionInfo: Record<string, any>) => void;
}



const AttendedProcessModal: React.FC<UserModalProps> = ({ open, setOpen, process, onSubmit }) => {
    const submitFormRef = React.useRef<any>();
    const processForm = useMemo(() => {
        if (!isJsonValid(process?.executionInfo)) return null;

        const parsedProcessForm = JSON.parse(process.executionInfo);

        return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [process.id]);

    const handleSubmit = (e: ISubmitEvent<any>) => {
        onSubmit(e.formData);
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
                {translate('Component.AttendedProcessFormModal.AttendedProcessModal.Title')} {process.name}
            </DialogTitle>
            <DialogContent>
                <ErrorBoundary key={process.id}>
                    {processForm && (
                        <FormRenderer
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

export default AttendedProcessModal;
