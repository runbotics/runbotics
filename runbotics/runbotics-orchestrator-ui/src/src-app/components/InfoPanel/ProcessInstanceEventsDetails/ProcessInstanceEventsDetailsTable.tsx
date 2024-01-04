import React, { VFC } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
    Button,
} from '@mui/material';
import dynamic from 'next/dynamic';
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

import {
    IProcessInstanceEvent,
    IProcessInstanceLoopEvent,
} from 'runbotics-common';

import useTranslations, {
    checkIfKeyExists,
} from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { processInstanceEventActions } from '#src-app/store/slices/ProcessInstanceEvent';
import { capitalizeFirstLetter } from '#src-app/utils/text';
import { formatDate } from '#src-app/utils/utils';

interface ProcessInstanceEventsDetailsTableProps {
    processInstanceEvent: IProcessInstanceEvent | IProcessInstanceLoopEvent;
}

const ProcessInstanceEventsDetailsTable: VFC<
    ProcessInstanceEventsDetailsTableProps
> = ({ processInstanceEvent }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();

    const getLoopLabel = () => {
        const translateKey = `Process.Details.Modeler.Actions.${capitalizeFirstLetter(
            { text: processInstanceEvent.step, delimiter: '.', join: '.' }
        )}.Label`;
        return checkIfKeyExists(translateKey)
            ? translateKey
            : processInstanceEvent.step;
    };

    const fetchLoopEvents = () => {
        dispatch(
            processInstanceEventActions.getProcessInstanceLoopEvents({
                loopId: processInstanceEvent.executionId,
                nestedIteration:
                    (processInstanceEvent as IProcessInstanceLoopEvent)
                        .iterationNumber ?? undefined,
                loopLabel: getLoopLabel(),
            })
        );
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <Typography variant="h6">
                                {translate(
                                    'Component.InfoPanel.EventsDetails.Table.Header.Started'
                                )}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            {processInstanceEvent.created
                                ? formatDate(processInstanceEvent.created)
                                : ''}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <Typography variant="h6">
                                {translate(
                                    'Component.InfoPanel.EventsDetails.Table.Header.Finished'
                                )}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            {processInstanceEvent.finished
                                ? formatDate(processInstanceEvent.finished)
                                : ''}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Accordion
                disableGutters
                disabled={!processInstanceEvent.input}
                sx={{ '&&': { borderRadius: 0 } }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                        {translate('Component.InfoPanel.EventsDetails.Input')}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer>
                        {processInstanceEvent.input && (
                            <ReactJson
                                src={JSON.parse(processInstanceEvent.input)}
                            />
                        )}
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
            <Accordion disableGutters disabled={!processInstanceEvent.output}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                        {translate('Component.InfoPanel.EventsDetails.Output')}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer>
                        {processInstanceEvent.output && (
                            <ReactJson
                                src={JSON.parse(processInstanceEvent.output)}
                                collapsed={2}
                            />
                        )}
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
            {processInstanceEvent.script === 'loop.loop' && (
                <Button
                    fullWidth
                    sx={{ paddingBlock: '10px' }}
                    onClick={fetchLoopEvents}
                >
                    {translate('Component.InfoPanel.Details.Loop.ShowMore')}
                </Button>
            )}
            {processInstanceEvent.error && (
                <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">
                            {translate(
                                'Component.InfoPanel.EventsDetails.Error'
                            )}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer>
                            <Typography>
                                {processInstanceEvent.error}
                            </Typography>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            )}
        </TableContainer>
    );
};

export default ProcessInstanceEventsDetailsTable;
