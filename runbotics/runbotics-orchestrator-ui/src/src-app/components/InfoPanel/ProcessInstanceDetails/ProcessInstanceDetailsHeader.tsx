import React, { VFC, useMemo, useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Dialog, Grid, LinearProgress, Tooltip, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { IProcessInstance, ProcessInstanceStatus, ProcessOutputType } from 'runbotics-common';

import Label from '#src-app/components/Label';
import If from '#src-app/components/utils/If';
import { useSelector } from '#src-app/store';
import { getProcessInstanceStatusColor } from '#src-app/utils/getProcessInstanceStatusColor';
import { capitalizeFirstLetter } from '#src-app/utils/text';
import { formatTimeDiff } from '#src-app/utils/utils';

import { Title } from '#src-app/views/utils/FormDialog.styles';

import { ProcessOutputButton } from './ProcessInstanceDetailsHeader.styles';
import { translate } from '../../../hooks/useTranslations';

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

interface Props {
    processInstance: IProcessInstance;
}

const isProcessInstanceActive = (
    status: ProcessInstanceStatus,
) => status === ProcessInstanceStatus.INITIALIZING
    || status === ProcessInstanceStatus.IN_PROGRESS;

const ProcessInstanceDetailsHeader: VFC<Props> = ({ processInstance }) => {
    const [open, setOpen] = useState(false);
    const { modeler: { currentProcessOutputElement }, draft: { process } } = useSelector(
        state => state.process
    );

    const formattedStatus = capitalizeFirstLetter({ text: processInstance.status, lowerCaseRest: true, delimiter: /_| / });

    const isProcessOutput = useMemo(() => {
        if (processInstance && processInstance?.output) {
            const processInstanceOutput = JSON.parse(processInstance.output);
            return !!(processInstanceOutput &&
                processInstance?.output.length &&
                currentProcessOutputElement &&
                !currentProcessOutputElement.businessObject.disabled);
        }
        return false;
    }, [processInstance, currentProcessOutputElement]);

    const processOutput = useMemo(() => {
        if (isProcessOutput && currentProcessOutputElement) {
            const processOutputVariableName = currentProcessOutputElement
                .businessObject
                .extensionElements
                .values[0]
                .outputParameters[1]
                .name;

            switch (process.outputType.type) {
                case ProcessOutputType.TEXT:
                    return processInstance.output;
                default:
                    return <ReactJson name={false} src={{ [processOutputVariableName]: JSON.parse(processInstance.output) }} />;
            }
        }
        return null;
    }, [
        isProcessOutput,
        currentProcessOutputElement,
        processInstance.output,
        process.outputType
    ]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">{processInstance.process.name}</Typography>
            </Grid>
            <Grid item container justifyContent={'space-between'} gap={2}>
                <Box display={'flex'} gap={2} alignItems={'center'}>
                    <Typography>
                        <Label warning={processInstance.warning} color={getProcessInstanceStatusColor(processInstance.status)}>
                            {/* @ts-ignore */}
                            {translate(`Process.Instance.Status.${formattedStatus}`)}
                        </Label>
                    </Typography>
                    <If condition={!!processInstance.updated}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: '0.3125rem' }}>
                            <AccessTimeIcon />
                            {formatTimeDiff(processInstance.created, processInstance.updated)}
                        </Typography>
                    </If>
                </Box>
                <If condition={isProcessOutput}>
                    <Box display={'flex'}>
                        <Tooltip title={translate('Process.ProcessInstance.Details.Header.Button.Tooltip')}>
                            <ProcessOutputButton
                                onClick={() => setOpen(true)}
                                variant="outlined"
                                color="secondary"
                            >
                                {translate('Process.ProcessInstance.Details.Header.Button')}
                            </ProcessOutputButton>
                        </Tooltip>
                    </Box>
                </If>
            </Grid>
            <If condition={isProcessInstanceActive(processInstance.status)} else={<Box height="20px" width="100%" />}>
                <Grid item xs={12}>
                    <LinearProgress />
                </Grid>
            </If>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <Title>
                    {translate('Process.ProcessInstance.Details.Header.Dialog.Title')}
                </Title>
                <Box padding={3} paddingTop={1}>
                    {processOutput}
                </Box>
            </Dialog>
        </Grid>
    );
};

export default ProcessInstanceDetailsHeader;
