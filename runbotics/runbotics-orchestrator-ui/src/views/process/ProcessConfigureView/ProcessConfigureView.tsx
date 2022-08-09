import { Box } from '@mui/material';
import React, { useEffect, useState, VFC } from 'react';
import { useParams } from 'react-router-dom';
import { IBotSystem, IBotCollection } from 'runbotics-common';
import { useDispatch, useSelector } from 'src/store';
import { botCollectionActions } from 'src/store/slices/BotCollections';
import { botSystemsActions } from 'src/store/slices/BotSystem';
import { processActions } from 'src/store/slices/Process';
import { ProcessParams } from 'src/utils/types/ProcessParams';
import BotCollectionComponent from './BotCollection.component';
import BotSystemComponent from './BotSystem.component';
import { Container, StyledPaper } from './ProcessConfigureView.styles';

const ProcessConfigureView: VFC = () => {
    const dispatch = useDispatch();
    const { process } = useSelector((state) => state.process.draft);
    const { id } = useParams<ProcessParams>();
    const processId = Number(id);

    const [selectedBotSystem, setSelectedBotSystem] = useState<IBotSystem>(process?.system);
    const [selectedBotCollection, setSelectedBotCollection] = useState<IBotCollection>(process?.botCollection);

    useEffect(() => {
        dispatch(botCollectionActions.getAll());
        dispatch(botSystemsActions.getAll());
    }, [processId]);

    useEffect(() => {
        if (process?.system) {
            setSelectedBotSystem(process.system);
        }
        if (process?.botCollection) {
            setSelectedBotCollection(process.botCollection);
        }
    }, [process]);

    const handleSelectBotSystem = async (system: IBotSystem) => {
        await dispatch(processActions.updateBotSystem({ id: process.id, system }));
        setSelectedBotSystem(system);
    };

    const handleSelectBotCollection = async (botCollection: IBotCollection) => {
        await dispatch(processActions.updateBotCollection({ id: process.id, botCollection }));
        setSelectedBotCollection(botCollection);
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
        </Container>
    );
};

export default ProcessConfigureView;
