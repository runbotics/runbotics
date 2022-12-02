import React, { FC } from 'react';

import {
    Avatar, Card, CardContent, Container, IconButton, SvgIcon, Typography, Box,
} from '@mui/material';
import clsx from 'clsx';
import cronstrue from 'cronstrue/i18n';
import i18n from 'i18next';
import { Trash as TrashIcon, Calendar as CalendarIcon } from 'react-feather';
import { FeatureKey } from 'runbotics-common';
import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';


import { scheduleProcessActions, scheduleProcessSelector } from '#src-app/store/slices/ScheduleProcess';




const PREFIX = 'SavedSchedule';

const classes = {
    card: `${PREFIX}-card`,
    cardContent: `${PREFIX}-cardContent`,
    typography: `${PREFIX}-typography`,
    avatar: `${PREFIX}-avatar`,
    deleteButton: `${PREFIX}-deleteButton`,
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

    [`& .${classes.deleteButton}`]: {
        width: 35,
        height: 35,
    },
}));

interface SavedScheduleProps {
    processId: number;
}

const SavedSchedule: FC<SavedScheduleProps> = ({ processId }) => {
    const dispatch = useDispatch();
    const {
        schedules,
    } = useSelector(scheduleProcessSelector);
    const { translate } = useTranslations();
    const hasDeleteScheduleAccess = useFeatureKey([FeatureKey.SCHEDULE_DELETE]);

    const handleDelete = async (id: number) => {
        await dispatch(scheduleProcessActions.removeScheduledProcess({ scheduleProcessId: id }));
        await dispatch(scheduleProcessActions.getSchedulesByProcess({ processId }));
    };

    const humanReadableCron = (cronExpression: string) => translate('Process.Schedule.Cron.HumanReadable', {
        cron: cronstrue
            .toString(cronExpression, { locale: i18n.language }).toLowerCase(),
    });

    return (
        <StyledContainer maxWidth={false} sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant="h4" gutterBottom>
                {translate('Process.Schedule.Title')}
            </Typography>
            <Box display="flex" flexDirection="column" gap="0.5rem">
                {schedules.map((schedule) => (
                    <Card key={schedule.id} className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <Box display="flex" alignItems="center">
                                <Avatar classes={{ root: clsx(classes.avatar) }}>
                                    <SvgIcon fontSize="small">
                                        <CalendarIcon />
                                    </SvgIcon>
                                </Avatar>
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
