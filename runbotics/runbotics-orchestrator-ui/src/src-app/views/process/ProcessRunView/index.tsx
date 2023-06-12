import { FC, useEffect, useRef } from 'react';

import { Card, Grid, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

import { FeatureKey } from 'runbotics-common';

import HistoryTable from '#src-app/components/tables/HistoryTable';
import If from '#src-app/components/utils/If';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector, useDispatch } from '#src-app/store';
import { currentProcessSelector } from '#src-app/store/slices/Process';
import {
    scheduleProcessActions,
    scheduleProcessSelector,
} from '#src-app/store/slices/ScheduleProcess';
import LoadingType from '#src-app/types/loading';

import RunProcessInstantly from './RunProcessInstantly';
import SavedSchedule from './SavedSchedule';
import ScheduleProcess from './ScheduleProcess';

const ValidationSchedule = styled('div')(
    ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: ${theme.typography.fontFamily};
    font-size: 0.875rem;
`
);

const ProcessRunView: FC = () => {
    const historyRef = useRef(null);
    const dispatch = useDispatch();
    const { id } = useRouter().query;
    const processId = Number(id);
    const { isAttended } = useSelector(currentProcessSelector);
    const { process, loading } = useSelector((state) => state.process.draft);
    const { schedules } = useSelector(scheduleProcessSelector);
    const hasReadHistoryAccess = useFeatureKey([
        FeatureKey.PROCESS_INSTANCE_HISTORY_READ,
    ]);
    const hasReadSchedulesAccess = useFeatureKey([FeatureKey.SCHEDULE_READ]);
    const hasAddScheduleAccess = useFeatureKey([FeatureKey.SCHEDULE_ADD]);

    const { translate } = useTranslations();
    
    useEffect(() => {
        if (hasReadSchedulesAccess)
        { dispatch(
            scheduleProcessActions.getSchedulesByProcess({ processId })
        ); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processId]);

    const handleProcessSchedule = async (data: Record<string, string>) => {
        await dispatch(
            scheduleProcessActions.scheduleProcess({
                cron: data.cron,
                process: {
                    id: processId,
                },
            })
        );
        dispatch(scheduleProcessActions.getSchedulesByProcess({ processId }));
    };

    if (
        !process ||
        process.id?.toString() !== id ||
        loading === LoadingType.PENDING
    )
    { return <LoadingScreen />; }

    return (
        <Grid sx={{ padding: '24px' }}>
            <Card>
                <Grid container>
                    <Grid item width="100%">
                        <Box padding="24px">
                            <Grid container spacing={2}>
                                <Grid item>
                                    <RunProcessInstantly
                                        onRunClick={
                                            historyRef.current
                                                ?.clearSelectedProcessInstance
                                        }
                                    />
                                </Grid>
                                <Grid item>
                                    <If condition={hasAddScheduleAccess}>
                                        <ScheduleProcess
                                            onProcessScheduler={
                                                handleProcessSchedule
                                            }
                                        />
                                    </If>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Card>
            <If condition={hasReadSchedulesAccess}>
                <Card sx={{ mt: 3, py: 3 }}>
                    <Grid item xs={12}>
                        <SavedSchedule processId={processId} />
                    </Grid>
                    <If condition={isAttended}>
                        <Grid item>
                            <ValidationSchedule>
                                {translate('Process.Run.ScheduleAttended.Message')}
                            </ValidationSchedule>
                        </Grid>
                    </If>
                    <If condition={schedules.length === 0 && 
                        !isAttended}>
                        <Grid item>
                            <ValidationSchedule>
                                {translate('Process.Run.NoSchedules.Message')}
                            </ValidationSchedule>
                        </Grid>
                    </If>
                </Card>
            </If>
            <If condition={hasReadHistoryAccess}>
                <Card sx={{ mt: '1.5rem' }}>
                    <Grid item xs={12} sx={{ padding: '1.5rem' }}>
                        <HistoryTable
                            ref={historyRef}
                            processId={processId}
                            title={
                                <Typography variant="h4" gutterBottom>
                                    {translate('Process.Run.History.Title')}
                                </Typography>
                            }
                            rerunEnabled
                        />
                    </Grid>
                </Card>
            </If>
        </Grid>
    );
};

export default ProcessRunView;
