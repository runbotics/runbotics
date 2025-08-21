import { ChangeEvent, VFC } from 'react';

import { Switch } from '@mui/material';

import { useSnackbar } from 'notistack';

import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { scheduleProcessActions } from '#src-app/store/slices/ScheduleProcess';
import { schedulerActions } from '#src-app/store/slices/Scheduler';

export interface ActiveScheduleSwitchProps {
    checked: boolean;
    disabled?: boolean;
    label?: string;
    scheduleId: string;
    processName?: string;
    processId?: string;
}

const ActiveScheduleSwitch: VFC<ActiveScheduleSwitchProps> = ({
    checked,
    scheduleId,
    processName,
    processId,
}) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        await dispatch(
            scheduleProcessActions.updateActiveFlagScheduledProcess({
                resourceId: scheduleId,
                pageParams: { active: !checked },
            })
        )
            .then(() => {
                enqueueSnackbar(
                    translate('Scheduler.Update.ScheduledProcess.Success', {
                        processName,
                    }),
                    {
                        variant: 'success',
                    }
                );
                dispatch(
                    schedulerActions.updateScheduledProcess({
                        id: scheduleId,
                        active: !checked,
                    })
                );
            })
            .catch(() =>
                enqueueSnackbar(
                    translate('Scheduler.Update.ScheduledProcess.Failed', {
                        processName,
                    }),
                    {
                        variant: 'error',
                    }
                )
            );
        await dispatch(
            scheduleProcessActions.getSchedulesByProcess({
                resourceId: processId,
            })
        );
    };
    return <Switch onChange={onChange} checked={checked} />;
};

export default ActiveScheduleSwitch;
