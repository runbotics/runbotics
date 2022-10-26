import { Card, Grid, Box, Typography } from '@mui/material';
import { FC, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'src/store';
import If from 'src/components/utils/If';
import { scheduleProcessActions, scheduleProcessSelector } from 'src/store/slices/ScheduleProcess';
import LoadingScreen from 'src/components/utils/LoadingScreen';
import LoadingType from 'src/types/loading';
import { FeatureKey } from 'runbotics-common';
import HistoryTable from 'src/components/HistoryTable';
import useTranslations from 'src/hooks/useTranslations';
import useFeatureKey from 'src/hooks/useFeatureKey';
import RunProcessInstantly from './RunProcessInstantly';
import ScheduleProcess from './ScheduleProcess';
import SavedSchedule from './SavedSchedule';

const ValidationSchedule = styled('div')(
    ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: ${theme.typography.fontFamily};
    font-size: 0.875rem;
`,
);

const ProcessRunView: FC = () => {
    const historyRef = useRef(null);
    const dispatch = useDispatch();
    const { id } = useRouter().query;
    const processId = Number(id);
    const { process, loading } = useSelector((state) => state.process.draft);
    const { schedules } = useSelector(scheduleProcessSelector);
    const hasReadHistoryAccess = useFeatureKey([FeatureKey.PROCESS_INSTANCE_HISTORY_READ]);
    const hasReadSchedulesAccess = useFeatureKey([FeatureKey.SCHEDULE_READ]);
    const hasAddScheduleAccess = useFeatureKey([FeatureKey.SCHEDULE_ADD]);

    const { translate } = useTranslations();

    useEffect(() => {
        if (hasReadSchedulesAccess) dispatch(scheduleProcessActions.getSchedulesByProcess({ processId }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processId]);

    const handleProcessSchedule = async (data: Record<string, string>) => {
        await dispatch(
            scheduleProcessActions.scheduleProcess({
                cron: data.cron,
                process: {
                    id: processId,
                },
            }),
        );
        dispatch(scheduleProcessActions.getSchedulesByProcess({ processId }));
    };

    if (!process || process.id?.toString() !== id || loading === LoadingType.PENDING) return <LoadingScreen />;

    return (
        <Grid sx={{ padding: '24px' }}>
            <Card>
                <Grid container>
                    <Grid item width="100%">
                        <Box padding="24px">
                            <Grid container spacing={2}>
                                <Grid item>
                                    <RunProcessInstantly
                                        onRunClick={historyRef.current?.clearSelectedProcessInstance}
                                    />
                                </Grid>
                                <Grid item>
                                    <If condition={hasAddScheduleAccess}>
                                        <ScheduleProcess onProcessScheduler={handleProcessSchedule} />
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
                    <If condition={schedules.length === 0}>
                        <Grid item>
                            <ValidationSchedule>{translate('Process.Run.NoSchedules.Message')}</ValidationSchedule>
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
                        />
                    </Grid>
                </Card>
            </If>
        </Grid>
    );
};

export default ProcessRunView;
