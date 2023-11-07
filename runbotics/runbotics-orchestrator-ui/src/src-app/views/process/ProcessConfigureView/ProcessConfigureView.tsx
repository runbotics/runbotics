import React, { useEffect, useMemo, useState, VFC } from 'react';

import { Box, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { IBotSystem, IBotCollection } from 'runbotics-common';

import NotificationTableComponent from '#src-app/components/tables/NotificationTable/NotificationTableComponent';
import { notificationTableColumns } from '#src-app/components/tables/NotificationTable/NotificationTableComponent.utils';
import If from '#src-app/components/utils/If';
import useAuth from '#src-app/hooks/useAuth';
import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import { botCollectionActions } from '#src-app/store/slices/BotCollections';

import { botSystemsActions } from '#src-app/store/slices/BotSystem';

import { processActions } from '#src-app/store/slices/Process';

import BotCollectionComponent from './BotCollection.component';
import BotSystemComponent from './BotSystem.component';
import ProcessAttendedComponent from './ProcessAttended.component';
import {
    Container,
    AttendancePaper,
    StyledPaper,
    ContainerWrapper,
} from './ProcessConfigureView.styles';
import ProcessNotificationComponent from './ProcessNotificationComponent';
import ProcessTriggerableComponent from './ProcessTriggerableComponent';


// eslint-disable-next-line max-lines-per-function
const ProcessConfigureView: VFC = () => {
    const dispatch = useDispatch();
    const { process } = useSelector((state) => state.process.draft);
    const isScheduled = process?.schedules?.length > 0;
    const { id } = useRouter().query;
    const processId = Number(id);

    const [selectedBotSystem, setSelectedBotSystem] = useState<IBotSystem>(
        process?.system
    );
    const [selectedBotCollection, setSelectedBotCollection] =
		useState<IBotCollection>(process?.botCollection);
    const [attended, setAttended] = useState(process?.isAttended);
    const [triggerable, setTriggerable] = useState(process?.isTriggerable);

    const { user } = useAuth();
    const [subscribed, setSubscribed] = useState(() =>
        Boolean(user.notifications.find(notification => notification.id.processId === processId))
    );

    console.log({notifications: user.notifications});
    console.log({process: process.notifications});

    const notificationTableRows = useMemo(() => {
        // TODO: need to be refactored
        if (process.notifications !== undefined) {
            return process.notifications.map(notification => ({
                id: notification.id.userId,
                user: notification.id.userId,
                subscribedAt: notification.subscribedAt,
                actions: 'action'
            }));
        }

        return [];
    }, [process]);

    useEffect(() => {
        dispatch(botCollectionActions.getAll());
        dispatch(botSystemsActions.getAll());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processId]);

    useEffect(() => {
        if (process?.system) setSelectedBotSystem(process.system);

        if (process?.botCollection) setSelectedBotCollection(process.botCollection);

        if (process?.isAttended) setAttended(process.isAttended);

        if (process?.isTriggerable) setTriggerable(process.isTriggerable);
    }, [process]);

    const fetchProcess = async () => {
        await dispatch(processActions.fetchProcessById(process.id));
    };

    const handleSelectBotSystem = async (system: IBotSystem) => {
        await dispatch(processActions.updateBotSystem({ id: process.id, system }));
        setSelectedBotSystem(system);
        await fetchProcess();
    };

    const handleSelectBotCollection = async (botCollection: IBotCollection) => {
        await dispatch(
            processActions.updateBotCollection({ id: process.id, botCollection })
        );
        setSelectedBotCollection(botCollection);
        await fetchProcess();
    };

    const handleAttendanceChange = async (isAttended: boolean) => {
        await dispatch(
            processActions.updateAttendance({ id: process.id, isAttended })
        );
        setAttended(isAttended);
        await fetchProcess();
    };

    const handleTriggerableChange = async (isTriggerable: boolean) => {
        await dispatch(
            processActions.updateTriggerable({ id: process.id, isTriggerable })
        );
        setTriggerable(isTriggerable);
        await fetchProcess();
    };

    const handleSubscriptionChange = async (subscriptionState: boolean) => {
        if (subscriptionState) {
            await dispatch(
                processActions.subscribeProcessNotifications({ userId: user.id, processId })
            );
        } else {
            await dispatch(
                processActions.unsubscribeProcessNotifications({ userId: user.id, processId })
            );
        }
        setSubscribed(subscriptionState);
        await fetchProcess();
    };

    const attendedBox = (
        <Box>
            <AttendancePaper>
                <ProcessAttendedComponent
                    isProcessAttended={attended}
                    onAttendedChange={handleAttendanceChange}
                />
            </AttendancePaper>
        </Box>
    );

    return (
        <ContainerWrapper>
            <Container>
                <Box>
                    <StyledPaper elevation={1}>
                        <BotSystemComponent
                            selectedBotSystem={selectedBotSystem}
                            onSelectBotSystem={handleSelectBotSystem}
                        />
                    </StyledPaper>
                </Box>
                <Box>
                    <StyledPaper elevation={1}>
                        <BotCollectionComponent
                            selectedBotCollection={selectedBotCollection}
                            onSelectBotCollection={handleSelectBotCollection}
                        />
                    </StyledPaper>
                </Box>
                <If condition={isScheduled} else={attendedBox}>
                    <Tooltip title={translate('Process.Configure.Attended.Schedule.Message')} placement="top">
                        {attendedBox}
                    </Tooltip>
                </If>
                <Box>
                    <StyledPaper>
                        <ProcessTriggerableComponent
                            isProcessTriggerable={triggerable}
                            onTriggerableChange={handleTriggerableChange}
                        />
                    </StyledPaper>
                </Box>
                <Box>
                    <StyledPaper>
                        <ProcessNotificationComponent
                            isProcessSubscribed={subscribed}
                            onSubscriptionChange={handleSubscriptionChange}
                        />
                    </StyledPaper>
                </Box>
            </Container>
            <NotificationTableComponent
                notificationTableColumns={notificationTableColumns}
                subscribersList={notificationTableRows}
            />
        </ContainerWrapper>
    );
};

export default ProcessConfigureView;
