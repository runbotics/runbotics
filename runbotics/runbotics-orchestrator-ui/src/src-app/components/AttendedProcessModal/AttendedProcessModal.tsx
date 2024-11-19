import React, { useMemo } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ISubmitEvent } from '@rjsf/core';
import { ProcessDto } from 'runbotics-common';

import ErrorBoundary from '#src-app/components/utils/ErrorBoundary';
import { translate } from '#src-app/hooks/useTranslations';
import { isJsonValid } from '#src-app/utils/utils';
import customWidgets from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets';

import FormRenderer from './FormRenderer';

interface UserModalProps {
    open: boolean;
    process: ProcessDto;
    setOpen: (open: boolean) => void;
    onSubmit: (executionInfo: Record<string, any>) => void;
    rerunInput?: {
        variables: unknown | null;
    };
}



const AttendedProcessModal: React.FC<UserModalProps> = ({ open, setOpen, process, onSubmit, rerunInput }) => {
    const submitFormRef = React.useRef<any>();

    const processForm = useMemo(() => {
        if (!open || !isJsonValid(process?.executionInfo)) return null;

        const parsedProcessForm = JSON.parse(process.executionInfo);

        if (!rerunInput || !rerunInput?.variables || !parsedProcessForm?.uiSchema) return parsedProcessForm;

        const fileVariables = Object.entries(parsedProcessForm.uiSchema)
            .reduce<string[]>((acc, [key, value]) => {
                if (value['ui:widget'] && value['ui:widget'] === 'FileDropzoneWidget') {
                    acc.push(key);
                }
                return acc;
            }, []);

        const filteredVariables = Object.entries(rerunInput.variables)
            .reduce((cos, [key, value]) => {
                if (!fileVariables.includes(key)) {
                    cos[key] = value;
                }
                return cos;
            }, {});

        parsedProcessForm.formData = filteredVariables;

        return parsedProcessForm;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [process.id, open]);

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
