import React, { FC, useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, SvgIcon, Button,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { PlusCircle as PlusIcon } from 'react-feather';
import { FormProps, ISubmitEvent, withTheme } from '@rjsf/core';
import { Theme5 as Mui5Theme } from '@rjsf/material-ui';
import { JSONSchema7 } from 'json-schema';
import Axios from 'axios';
import { BotSystem, IProcess } from 'runbotics-common';
import { ProcessTab } from 'src/utils/process-tab';
import useTranslations, { translate } from 'src/hooks/useTranslations';
import emptyBpmn from './ProcessBuildView/Modeler/empty.bpmn';
import { useDispatch } from 'src/store';
import { processActions } from 'src/store/slices/Process';

const Form = withTheme<any>(Mui5Theme) as FC<FormProps<any> & { ref: any }>;

const schema: JSONSchema7 = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: translate('Process.Add.Form.Fields.Name'),
            pattern: '[A-z0-9]',
        },
    },
    required: ['name'],
};

const formData: IProcess = {
    isPublic: false,
    name: '',
    description: '',
    definition: emptyBpmn,
};

enum ErrorType {
    NAME_NOT_AVAILABLE = 'NAME_NOT_AVAILABLE',
}

const errorMessages: Record<ErrorType, string> = {
    [ErrorType.NAME_NOT_AVAILABLE]: translate('Process.Error.NameNotAvailable'),
};

type AddProcessDialogProps = {
    open?: boolean;
    onClose: () => void;
    onAdd: (process: IProcess) => void;
};

const AddProcessDialog: FC<AddProcessDialogProps> = (props) => {
    const ref = React.useRef<any>();
    const submitFormRef = React.useRef<any>();
    const [errorType, setErrorType] = useState<ErrorType | null>(null);
    const { translate } = useTranslations();
    const dispatch = useDispatch();

    const handleSubmit = async (e: ISubmitEvent<IProcess>) => {
        const isAvailable = await dispatch(processActions.isProcessAvailable({ processName: e.formData.name }));
        if (isAvailable.meta.requestStatus === 'rejected') {
            setErrorType(ErrorType.NAME_NOT_AVAILABLE);
            return;
        }
        setErrorType(null);

        const result = await Axios.post<IProcess>('/api/processes', e.formData);
        props.onAdd(result.data);
    };

    const extraErrors = errorType !== null ? {
        name: {
            __errors: [ errorMessages[errorType] ],
        },
    } : undefined;

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="lg">
            <DialogTitle>{translate('Process.Add.Title')}</DialogTitle>
            <DialogContent>
                <Form
                    ref={ref}
                    schema={schema}
                    formData={formData}
                    onSubmit={handleSubmit}
                    showErrorList={false}
                    extraErrors={extraErrors}
                >
                    <button
                        ref={submitFormRef}
                        type="submit"
                        style={{ display: 'none' }}
                        aria-label={translate('Common.Submit')}
                    />
                </Form>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={props.onClose}
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
            {showDialog && <AddProcessDialog open={showDialog} onClose={() => setShowDialog(false)} onAdd={handleAdd} />}
        </>
    );
};

export default AddProcess;
