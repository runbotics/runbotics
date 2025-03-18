import React, { VFC, useMemo, useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, Grid, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { IProcessInstance, ProcessOutputType } from 'runbotics-common';

import Label from '#src-app/components/Label';
import If from '#src-app/components/utils/If';
import { useSelector } from '#src-app/store';
import { getProcessInstanceStatusColor } from '#src-app/utils/getProcessInstanceStatusColor';
import { capitalizeFirstLetter } from '#src-app/utils/text';
import { formatTimeDiff } from '#src-app/utils/utils';

import { Title } from '#src-app/views/utils/FormDialog.styles';

import { HeaderWrapper, ProcessOutputButton, TextOutputWrapper } from './ProcessInstanceDetailsHeader.styles';
import {
    hasProcessOutputProperty,
    isElementEnabled,
    isProcessInstanceActive,
    isProcessOutputValid,
} from './ProcessInstanceDetailsHeader.utils';
import { translate } from '../../../hooks/useTranslations';

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

interface Props {
    processInstance: IProcessInstance;
}

const ProcessInstanceDetailsHeader: VFC<Props> = ({ processInstance }) => {
    const [open, setOpen] = useState(false);
    const { modeler: { currentProcessOutputElement }, draft: { process } } = useSelector(
        state => state.process
    );

    const formattedStatus = capitalizeFirstLetter({ text: processInstance.status, lowerCaseRest: true, delimiter: /_| / });

    const isProcessOutput = useMemo(() =>
        isProcessOutputValid(processInstance) &&
        (isElementEnabled(currentProcessOutputElement) ||
        hasProcessOutputProperty(processInstance?.output))
    , [processInstance, currentProcessOutputElement]);

    const processOutput = useMemo(() => {
        if (isProcessOutput) {
            
            const parsedOutput = JSON.parse(processInstance.output);
            const output: Record<string, unknown> = 
                parsedOutput?.processOutput ?? parsedOutput?.partialResponse?.processOutput;

            if (output === undefined) return null;

            const processOutputValue = Object.values(output)[0];

            switch (process.output.type) {
                case ProcessOutputType.TEXT:
                    return <TextOutputWrapper>
                        <Typography variant='body2'>{processOutputValue}</Typography>
                    </TextOutputWrapper>;
                case ProcessOutputType.HTML:
                    if (typeof processOutputValue !== 'string') {
                        return translate('Process.ProcessInstance.Details.Header.Dialog.InvalidOutputType');
                    }

                    const parser = new DOMParser();
                    const parsedHtml = parser.parseFromString(processOutputValue, 'text/html');

                    return <pre>{parsedHtml.documentElement.outerHTML}</pre>;
                default:
                    return <ReactJson name={false} src={output}/>;
            }
        }
        return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ isProcessOutput, processInstance.output, process.output ]);

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
                <HeaderWrapper>
                    <Grid item>
                        <Title>
                            {translate('Process.ProcessInstance.Details.Header.Dialog.Title')}
                        </Title>
                    </Grid>
                    <Grid item paddingX={'1rem'}>
                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </HeaderWrapper>
                <Box
                    padding={3}
                    paddingTop={0}
                    minHeight={250}
                    minWidth={500}
                    overflow={'auto'}
                >
                    {processOutput}
                </Box>
            </Dialog>
        </Grid>
    );
};

export default ProcessInstanceDetailsHeader;
