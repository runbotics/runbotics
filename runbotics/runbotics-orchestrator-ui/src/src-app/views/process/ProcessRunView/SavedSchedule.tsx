import React, { FC } from 'react';

import {
    Avatar, Box, Card, CardContent, Container, IconButton, SvgIcon, Tooltip, Typography
} from '@mui/material';
import clsx from 'clsx';
import cronstrue from 'cronstrue/i18n';
import i18n from 'i18next';
import { Trash as TrashIcon, Calendar as CalendarIcon, List as ListIcon } from 'react-feather';
import { FeatureKey, ProcessDto } from 'runbotics-common';
import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';


import { processActions } from '#src-app/store/slices/Process';
import { scheduleProcessActions, scheduleProcessSelector } from '#src-app/store/slices/ScheduleProcess';
import { IScheduleProcess } from '#src-app/types/model/schedule-process.model';




const PREFIX = 'SavedSchedule';

const classes = {
    card: `${PREFIX}-card`,
    cardContent: `${PREFIX}-cardContent`,
    typography: `${PREFIX}-typography`,
    avatar: `${PREFIX}-avatar`,
    deleteButton: `${PREFIX}-deleteButton`,
    attendedIcon: `${PREFIX}-attendedIcon`,
};

const StyledContainer = styled(Container)(({ theme }) => ({
    [`& .${classes.card}`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    [`& .${classes.cardContent}`]: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: '1rem !important',
    },

    [`& .${classes.cardContent}.disabled`]: {
        backgroundColor: theme.palette.tag.action,
    },

    [`& .${classes.typography}`]: {
        display: 'flex',
        marginLeft: theme.spacing(2),
        padding: '0.375rem',
    },

    [`& .${classes.avatar}`]: {
        display: 'flex',
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        width: 30,
        height: 30,
    },

    [`& .${classes.avatar}.disabled`]: {
        backgroundColor: theme.palette.tag.variable,
    },

    [`& .${classes.deleteButton}`]: {
        width: 35,
        height: 35,
    },

    [`& .${classes.attendedIcon}`]: {
        margin: 4,
    },
}));

interface SavedScheduleProps {
    process: ProcessDto;
}

const SavedSchedule: FC<SavedScheduleProps> = ({ process }) => {
    const dispatch = useDispatch();
    const processId = process.id;
    const {
        schedules,
    } = useSelector(scheduleProcessSelector);
    const { translate } = useTranslations();
    const hasDeleteScheduleAccess = useFeatureKey([FeatureKey.SCHEDULE_DELETE]);

    const handleDelete = async (id: number) => {
        await dispatch(scheduleProcessActions.removeScheduledProcess({ resourceId: id }));
        await dispatch(scheduleProcessActions.getSchedulesByProcess({
            resourceId: processId
        }));
        dispatch(processActions.removeDraftProcessSchedule(id));
    };

    const humanReadableCron = (cronExpression: string) => translate('Process.Schedule.Cron.HumanReadable', {
        cron: cronstrue
            .toString(cronExpression, { locale: i18n.language }).toLowerCase(),
    });

    const attendedInfo = (schedule: IScheduleProcess) => (
        <div className={classes.attendedIcon}>
            <If condition={Boolean(schedule.inputVariables)}>
                <Tooltip title={<pre>{schedule.inputVariables}</pre>}>
                    <Avatar classes={{ root: clsx(classes.avatar, { 'disabled': isNotRunableSchedule(schedule) }) }}>
                        <SvgIcon fontSize="small">
                            <ListIcon />
                        </SvgIcon>
                    </Avatar>
                </Tooltip>
            </If>
        </div>
    );

    const isNotRunableSchedule = (schedule: IScheduleProcess) => !schedule.inputVariables && process.isAttended;

    return (
        <StyledContainer maxWidth={false} sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant="h4" gutterBottom>
                {translate('Process.Schedule.Title')}
            </Typography>
            <Box display="flex" flexDirection="column" gap="0.5rem">
                {schedules.map((schedule) => (
                    <Card key={schedule.id} className={classes.card}>
                        <CardContent classes={{ root: clsx(classes.cardContent, { 'disabled': isNotRunableSchedule(schedule) }) }}>
                            <Box display="flex" alignItems="center">
                                <Avatar classes={{ root: clsx(classes.avatar, { 'disabled': isNotRunableSchedule(schedule) }) }}>
                                    <SvgIcon fontSize="small">
                                        <CalendarIcon />
                                    </SvgIcon>
                                </Avatar>
                                {attendedInfo(schedule)}
                                <Typography
                                    variant="body1"
                                    className={classes.typography}
                                >
                                    {humanReadableCron(schedule.cron)}
                                </Typography>
                            </Box>
                            <If condition={hasDeleteScheduleAccess}>
                                <IconButton className={classes.deleteButton} onClick={() => handleDelete(schedule.id)}>
                                    <SvgIcon fontSize="small" color="secondary">
                                        <TrashIcon />
                                    </SvgIcon>
                                </IconButton>
                            </If>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </StyledContainer>
    );
};

export default SavedSchedule;
