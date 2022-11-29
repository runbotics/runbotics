import React, { useEffect, useState, VFC } from 'react';

import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { IBotSystem, IBotCollection } from 'runbotics-common';

import { useDispatch, useSelector } from '#src-app/store';
import { botCollectionActions } from '#src-app/store/slices/BotCollections';
import { botSystemsActions } from '#src-app/store/slices/BotSystem';
import { processActions } from '#src-app/store/slices/Process';

import ManageProcessForm from '../ProcessRunView/ManageProcessForm';
import BotCollectionComponent from './BotCollection.component';
import BotSystemComponent from './BotSystem.component';
import ProcessAttendedComponent from './ProcessAttended.component';
import { Container, AttendancePaper, StyledPaper } from './ProcessConfigureView.styles';
import ProcessTriggerableComponent from './ProcessTriggerableComponent';

const ProcessConfigureView: VFC = () => {
    const dispatch = useDispatch();
    const { process } = useSelector((state) => state.process.draft);
    const { id } = useRouter().query;
    const processId = Number(id);

    const [selectedBotSystem, setSelectedBotSystem] = useState<IBotSystem>(process?.system);
    const [selectedBotCollection, setSelectedBotCollection] = useState<IBotCollection>(process?.botCollection);
    const [attended, setAttended] = useState(process?.isAttended);
    const [triggerable, setTriggerable] = useState(process?.isTriggerable);

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

    const handleSelectBotSystem = async (system: IBotSystem) => {
        await dispatch(processActions.updateBotSystem({ id: process.id, system }));
        setSelectedBotSystem(system);
    };

    const handleSelectBotCollection = async (botCollection: IBotCollection) => {
        await dispatch(processActions.updateBotCollection({ id: process.id, botCollection }));
        setSelectedBotCollection(botCollection);
    };

    const handleAttendanceChange = async (isAttended: boolean) => {
        await dispatch(processActions.updateAttendedance({ ...process, isAttended }));
        setAttended(isAttended);
        await dispatch(processActions.fetchProcessById(process.id));
    };

    const handleTriggerableChange = async (isTriggerable: boolean) => {
        await dispatch(processActions.updateTriggerable({ ...process, isTriggerable }));
        setTriggerable(isTriggerable);
        await dispatch(processActions.fetchProcessById(process.id));
    };

    return (
        <Container>
            <Box width="fit-content">
                <StyledPaper elevation={1}>
                    <BotSystemComponent
                        selectedBotSystem={selectedBotSystem}
                        onSelectBotSystem={handleSelectBotSystem}
                    />
                </StyledPaper>
            </Box>
            <Box width="fit-content">
                <StyledPaper elevation={1}>
                    <BotCollectionComponent
                        selectedBotCollection={selectedBotCollection}
                        onSelectBotCollection={handleSelectBotCollection}
                    />
                </StyledPaper>
            </Box>
            <Box width="fit-content">
                <AttendancePaper>
                    <ProcessAttendedComponent isProcessAttended={attended} onAttendedChange={handleAttendanceChange} />
                    <ManageProcessForm />
                </AttendancePaper>
            </Box>
            <Box width="fit-content">
                <StyledPaper>
                    <ProcessTriggerableComponent
                        isProcessTriggerable={triggerable}
                        onTriggerableChange={handleTriggerableChange}
                    />
                </StyledPaper>
            </Box>
        </Container>
    );
};

export default ProcessConfigureView;
