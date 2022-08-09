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
import useTranslations, { translate as t } from 'src/hooks/useTranslations';
import emptyBpmn from './ProcessBuildView/Modeler/empty.bpmn';

const Form = withTheme<any>(Mui5Theme) as FC<FormProps<any> & { ref: any }>;

const schema: JSONSchema7 = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: t('Process.Add.Form.Fields.Name'),
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

type AddProcessDialogProps = {
    open?: boolean;
    onClose: () => void;
    onAdd: (process: IProcess) => void;
};

const AddProcessDialog: FC<AddProcessDialogProps> = (props) => {
    const ref = React.useRef<any>();
    const submitFormRef = React.useRef<any>();
    const { translate } = useTranslations();

    const handleSubmit = async (e: ISubmitEvent<IProcess>) => {
        const result = await Axios.post<IProcess>('/api/processes', e.formData);
        props.onAdd(result.data);
    };

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="lg">
            <DialogTitle>{translate('Process.Add.Title')}</DialogTitle>
            <DialogContent>
                <Form ref={ref} schema={schema} formData={formData} onSubmit={handleSubmit}>
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
    const [show, setShow] = useState(false);
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
                onClick={() => setShow(true)}
                startIcon={(
                    <SvgIcon fontSize="small">
                        <PlusIcon />
                    </SvgIcon>
                )}
            >
                {translate('Process.Add.ActionName')}
            </Button>
            {show && <AddProcessDialog open={show} onClose={() => setShow(false)} onAdd={handleAdd} />}
        </>
    );
};

export default AddProcess;
