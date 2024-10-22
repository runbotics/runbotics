import { useEffect } from 'react';

import { Box, Chip, Typography } from '@mui/material';
import cronstrue from 'cronstrue/i18n';
import i18n from 'i18next';
import moment from 'moment';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import {
    scheduleProcessActions,
    scheduleProcessSelector,
} from '#src-app/store/slices/ScheduleProcess';

import {
    DetailsInfoTabProps,
    ProcessDetailsTab,
} from '../ProcessDetailsDialog.types';

export const SchedulesTab = ({ value, process }: DetailsInfoTabProps) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { schedules } = useSelector(scheduleProcessSelector);
    const processId = process.id;
    const hasSchedules = schedules.length > 0;
    const lastRun = process.lastRun
        ? moment(process.lastRun).fromNow()
        : translate('Component.Tile.Process.Content.LastRun.Placeholder');

    const humanReadableCron = (cronExpression: string) =>
        cronstrue
            .toString(cronExpression, { locale: i18n.language })
            .toLowerCase();

    useEffect(() => {
        dispatch(
            scheduleProcessActions.getSchedulesByProcess({
                resourceId: processId,
            })
        );
    }, []);

    return (
        <Box hidden={value !== ProcessDetailsTab.SCHEDULES}>
            <Box
                display="flex"
                flexWrap="wrap"
                mt={2}
                gap={1}
                alignItems="center"
            >
                <Typography variant="h5">
                    {translate(
                        'Component.Tile.Process.DetailsDialog.TabContent.SchedulesLabel.Scheduled'
                    )}
                </Typography>
                <If
                    condition={hasSchedules}
                    else={
                        <Typography>
                            {translate(
                                'Component.Tile.Process.DetailsDialog.TabContent.SchedulesLabel.Scheduled.Placeholder'
                            )}
                        </Typography>
                    }
                >
                    {schedules.map((schedule) => (
                        <Chip
                            label={humanReadableCron(schedule.cron)}
                            key={schedule?.id}
                            size="small"
                        />
                    ))}
                </If>
            </Box>
            <Box display="flex" mt={2} gap={1} alignItems="end">
                <Typography variant="h5">
                    {translate('Component.Tile.Process.Content.LastRun')}
                </Typography>
                <Typography>{lastRun}</Typography>
            </Box>
        </Box>
    );
};
