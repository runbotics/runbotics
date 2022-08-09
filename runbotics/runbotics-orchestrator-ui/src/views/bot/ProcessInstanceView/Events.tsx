import React, { FC, useEffect } from 'react';
import {
    Grid,
    LinearProgress,
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridValueFormatterParams,
} from '@mui/x-data-grid';
import moment from 'moment';
import { useDispatch, useSelector } from 'src/store';
import { processInstanceEventActions, processInstanceEventSelector } from 'src/store/slices/ProcessInstanceEvent';
import { IProcessInstance } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';

interface IndexProps {
    processInstance: IProcessInstance;
}

const Index: FC<IndexProps> = ({ processInstance }) => {
    const { translate } = useTranslations();

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: translate('Process.PIView.Table.Events.Header.Id'),
        },
        {
            field: 'created',
            headerName: translate('Process.PIView.Table.Events.Header.Created'),
            width: 200,
            valueFormatter: (params: GridValueFormatterParams) => moment(params.value as string)
                .format('YYYY-MM-DD HH:mm:ss.SS'),
        },
        {
            field: 'log',
            headerName: translate('Process.PIView.Table.Events.Header.Log'),
            flex: 0.3,
        },
    ];

    const processInstanceEvents = useSelector(processInstanceEventSelector);
    const { loading, events } = processInstanceEvents.all;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(processInstanceEventActions.getProcessInstanceEvents({ processInstanceId: processInstance.id }));
    }, [processInstance.id]);

    return (
        <>
            {loading && <LinearProgress />}
            {!loading && (
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <DataGrid
                            sortModel={[
                                {
                                    field: 'created',
                                    sort: 'asc',
                                },
                            ]}
                            autoHeight
                            rows={events}
                            columns={columns}
                        />
                    </Grid>
                </Grid>
            )}
        </>
    );
};
export default Index;
