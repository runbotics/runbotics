import React, { FC, useEffect, useState } from 'react';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    LinearProgress,
    Tooltip,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    SelectChangeEvent
} from '@mui/material';
import {
    FormProps,
    IChangeEvent,
    ISubmitEvent,
    UiSchema,
    withTheme
} from '@rjsf/core';
import { Theme5 as Mui5Theme } from '@rjsf/material-ui';
import { JSONSchema7 } from 'json-schema';
import { IProcess } from 'runbotics-common';
import { v4 as uuidv4 } from 'uuid';

import { translate } from '#src-app/hooks/useTranslations';

import JSONSchemaFormRenderer from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/renderers/JSONSchemaFormRenderer';

import customWidgets from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets';

import { defaultForm } from './utils';
import ErrorBoundary from '../utils/ErrorBoundary';

import If from '../utils/If';

const WIDGET_NAME_MAX_LENGTH = 320;

interface AdminModalProps {
    process: IProcess;
    open: boolean;
    setOpen: (open: boolean) => void;
    onSubmit: (executionInfoSchema: string) => void;
    onDelete: () => void;
}

const Form = withTheme<any>(Mui5Theme) as FC<FormProps<any> & { ref: any }>;

const schema: JSONSchema7 = {
    type: 'object',
    properties: {
        form: {
            type: 'string',
            title: 'Form'
        }
    },
    required: ['form']
};

const uiSchema: UiSchema = {
    form: {
        'ui:widget': 'EditorWidget',
        'ui:options': {
            language: 'json'
        }
    }
};

function isJsonValid(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const selectInputStyle = {
    width: `${WIDGET_NAME_MAX_LENGTH}px`,
    marginRight: '20px'
};


// eslint-disable-next-line max-lines-per-function
const ManageAttendedProcessModal: React.FC<AdminModalProps> = ({
    open,
    setOpen,
    process,
    onSubmit,
    onDelete
}) => {
    const ref = React.useRef<any>();
    const submitFormRef = React.useRef<any>();
    const [draft, setDraft] = useState<any>({
        form: process?.executionInfo ? process.executionInfo : defaultForm
    });
    const [live, setLive] = useState<any>();
    const [loading, setLoading] = useState(false);
    const isDeleteDisabled = !process?.executionInfo;

    const [selectedWidget, setSelectedWidget] = useState('');
    const [showCopyMessage, setShowCopyMessage] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (isJsonValid(draft.form)) {
            setLive({
                id: uuidv4(),
                definition: JSON.parse(draft.form)
            });
            setLoading(false);
        }
    }, [draft.form]);

    const handleSubmit = (e: ISubmitEvent<any>) => {
        if (isJsonValid(e.formData.form)) onSubmit(e.formData.form);
    };

    const handleChange = (e: IChangeEvent<IProcess>) => {
        setDraft(e.formData);
    };

    const copyWidgetToClipboard = (e: SelectChangeEvent<string>) => {
        setSelectedWidget(e.target.value);
        const copyObject = {
            customWidget: {
                'ui:widget': e.target.value
            }
        };

        navigator.clipboard.writeText(JSON.stringify(copyObject).slice(1, -1));

        setShowCopyMessage(true);
        setTimeout(() => { setShowCopyMessage(false); }, 6000);
    };

    const deleteButton = (
        <Button
            color="primary"
            onClick={() => {
                onDelete();
                setOpen(false);
            }}
            disabled={isDeleteDisabled}>
            {translate('Common.Delete')}
        </Button>
    );

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="xl"
            fullWidth>
            <DialogTitle>
                {translate(
                    'Component.AttendedProcessFormModal.ManageAttendedProcessModal.Title'
                )}{' '}
                {process.name}
            </DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={8}>
                        <Form
                            liveValidate
                            ref={ref}
                            schema={schema}
                            widgets={customWidgets}
                            uiSchema={uiSchema}
                            formData={draft}
                            onChange={handleChange}
                            onSubmit={handleSubmit}>
                            <Button
                                ref={submitFormRef}
                                type="submit"
                                style={{ display: 'none' }}
                            />
                        </Form>
                    </Grid>
                    <Grid item xs={4}>
                        <Box px={2} pt={1}>
                            <Typography variant="h4" gutterBottom></Typography>
                        </Box>
                        <LinearProgress
                            variant={loading ? 'indeterminate' : 'determinate'}
                            value={0}
                        />

                        {live && live?.id && live?.definition?.schema && (
                            <ErrorBoundary key={live.id}>
                                <JSONSchemaFormRenderer
                                    id={live.id}
                                    schema={live.definition.schema}
                                    uiSchema={live.definition.uiSchema}
                                    formData={live.definition.formData}
                                    widgets={customWidgets}
                                />
                            </ErrorBoundary>
                        )}
                    </Grid>
                </Grid>
                <FormControl
                    sx={{ flexDirection: 'row', alignItems: 'center', marginTop: '5px' }}
                >
                    <InputLabel
                        sx={selectInputStyle}
                    >
                        {translate('Component.AttendedProcessFormModal.ManageAttendedProcessModal.Select.Widget.Label')}
                    </InputLabel>
                    <Select
                        variant='outlined'
                        label={translate('Component.AttendedProcessFormModal.ManageAttendedProcessModal.Select.Widget.Label')}
                        sx={selectInputStyle}
                        value={selectedWidget}
                        onChange={copyWidgetToClipboard}
                    >
                        {Object.keys(customWidgets).map(widget =>
                            <MenuItem
                                key={widget}
                                value={widget}
                            >
                                {widget}
                            </MenuItem>
                        )}
                    </Select>
                    <If condition={showCopyMessage}>
                        <Typography
                            color='primary'
                        >
                            {translate('Component.AttendedProcessFormModal.ManageAttendedProcessModal.Select.Widget.CopyMessage')}
                        </Typography>
                    </If>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <If condition={isDeleteDisabled} else={deleteButton}>
                    <Tooltip
                        title={translate(
                            'Component.AttendedProcessFormModal.ManageAttendedProcessModal.Delete.Tooltip'
                        )}>
                        <span>{deleteButton}</span>
                    </Tooltip>
                </If>
                <Button color="primary" onClick={() => setOpen(false)}>
                    {translate('Common.Cancel')}
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    variant="contained"
                    color="primary"
                    autoFocus
                    onClick={() => {
                        submitFormRef.current.click();
                    }}>
                    {translate('Common.Save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ManageAttendedProcessModal;
