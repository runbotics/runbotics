import React, { VFC } from 'react';
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
} from '@mui/material';
import { IProcessInstanceEvent } from 'runbotics-common';
import ReactJson from 'react-json-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatDate } from 'src/utils/utils';
import useTranslations from 'src/hooks/useTranslations';

interface Props {
    processInstanceEvent: IProcessInstanceEvent;
}

const ProcessInstanceEventsDetailsTable: VFC<Props> = ({ processInstanceEvent }) => {
    const { translate } = useTranslations();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <Typography variant="h6">
                                {translate('Component.InfoPanel.EventsDetails.Table.Header.Started')}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            {processInstanceEvent.created ? formatDate(processInstanceEvent.created) : ''}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <Typography variant="h6">
                                {translate('Component.InfoPanel.EventsDetails.Table.Header.Finished')}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            {processInstanceEvent.finished ? formatDate(processInstanceEvent.finished) : ''}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Accordion disableGutters disabled={!processInstanceEvent.input} sx={{ '&&': { borderRadius: 0 } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                        {translate('Component.InfoPanel.EventsDetails.Input')}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer>
                        {processInstanceEvent.input && <ReactJson src={JSON.parse(processInstanceEvent.input)} />}
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
                        {processInstanceEvent.output && <ReactJson src={JSON.parse(processInstanceEvent.output)} />}
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
            {processInstanceEvent.error && (
                <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">
                            {translate('Component.InfoPanel.EventsDetails.Error')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer>
                            <Typography>{processInstanceEvent.error}</Typography>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            )}
        </TableContainer>
    );
};

export default ProcessInstanceEventsDetailsTable;
