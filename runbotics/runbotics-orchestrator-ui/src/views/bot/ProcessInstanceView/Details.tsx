import React, { FC } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import { IProcessInstance } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';

interface IndexProps {
    processInstance: IProcessInstance;
}

const Index: FC<IndexProps> = ({ processInstance }) => {
    const { translate } = useTranslations();

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="h6">
                                            {translate('Process.PIView.Table.Details.Header.Process')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{processInstance.process.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="h6">
                                            {translate('Process.PIView.Table.Details.Header.Status')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{processInstance.status}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="h6">
                                            {translate('Process.PIView.Table.Details.Header.ProcessInstanceID')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{processInstance.id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="h6">
                                            {translate('Process.PIView.Table.Details.Header.OrchestratorProcessID')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{processInstance.orchestratorProcessInstanceId}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="h6">
                                            {translate('Process.PIView.Table.Details.Header.Created')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {moment(processInstance.created).format('YYYY-MM-DD HH:mm:ss')}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="h6">
                                            {translate('Process.PIView.Table.Details.Header.Updated')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {moment(processInstance.updated).format('YYYY-MM-DD HH:mm:ss')}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="h6">
                                            {translate('Process.PIView.Table.Details.Header.Input')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {processInstance.input && <ReactJson src={JSON.parse(processInstance.input)} />}
                                        {!processInstance.input && (
                                            <>{translate('Process.PIView.Table.Details.Data.NoInput')}</>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="h6">
                                            {translate('Process.PIView.Table.Details.Header.Output')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {processInstance.output && (
                                            <ReactJson src={JSON.parse(processInstance.output)} />
                                        )}
                                        {!processInstance.output && (
                                            <>{translate('Process.PIView.Table.Details.Data.NoOutput')}</>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    );
};

export default Index;
