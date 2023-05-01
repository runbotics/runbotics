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
} from '@mui/material';
import dynamic from 'next/dynamic';
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });
import { IProcessInstance } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { formatDate } from '#src-app/utils/utils';

interface Props {
    processInstance: IProcessInstance;
}

const ProcessInstanceDetailsTable: VFC<Props> = ({ processInstance }) => {
    const { translate } = useTranslations();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell component="th" scope="row" style={{ width: 100 }}>
                            <Typography variant="h6">
                                {translate('Component.InfoPanel.Details.Table.Header.Started')}
                            </Typography>
                        </TableCell>
                        <TableCell>{processInstance.created ? formatDate(processInstance.created) : ''}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <Typography variant="h6">
                                {translate('Component.InfoPanel.Details.Table.Header.Finished')}
                            </Typography>
                        </TableCell>
                        <TableCell>{processInstance.updated ? formatDate(processInstance.updated) : ''}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Accordion
                disableGutters
                disabled={!processInstance.input}
                sx={{
                    '&&': {
                        borderRadius: 0,
                        borderTop: 'none',
                    },
                }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{translate('Component.InfoPanel.Details.Input')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer>
                        {processInstance.input && <ReactJson src={JSON.parse(processInstance.input)} />}
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
            <Accordion
                disableGutters
                disabled={!processInstance.output}
                sx={{
                    '&&&': {
                        borderTop: (theme) => `1px solid ${theme.palette.grey[300]}`,
                        boxShadow: 'none',
                        ':before': {
                            display: 'none',
                        },
                    },
                }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{translate('Component.InfoPanel.Details.Output')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer>
                        {processInstance.output && <ReactJson src={JSON.parse(processInstance.output)} />}
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
            {processInstance.error && (
                <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">{translate('Component.InfoPanel.Details.Error')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer>
                            <Typography>{processInstance.error}</Typography>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            )}
        </TableContainer>
    );
};

export default ProcessInstanceDetailsTable;
