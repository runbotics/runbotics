import React, { VFC, ChangeEvent } from 'react';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { MenuItem, Select } from '@mui/material';
import { useSelector } from 'src/store';
import { botCollectionSelector } from 'src/store/slices/BotCollections';
import { IBotCollection } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';
import { Wrapper } from './BotComponent.styles';

interface BotCollectionProps {
    selectedBotCollection: IBotCollection;
    onSelectBotCollection?: (collection: IBotCollection) => void;
}

const BotCollectionComponent: VFC<BotCollectionProps> = ({
    selectedBotCollection, onSelectBotCollection,
}) => {
    const { botCollections } = useSelector(botCollectionSelector);
    const { translate } = useTranslations();

    const getBotCollectionsOptions = () => botCollections.map((collection) => (
        <MenuItem value={collection.id} key={collection.id}>
            {collection.name}
        </MenuItem>
    ));

    const handleBotCollectionChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selected = botCollections.find((collection) => event.target.value === collection.id);
        onSelectBotCollection?.(selected);
    };

    return (
        <Wrapper>
            <PrecisionManufacturingIcon />
            {`${translate('Process.Run.BotCollection')}: `}
            <Select
                style={{ minWidth: '8rem', height: '1.75rem' }}
                SelectDisplayProps={{
                    style: {
                        paddingBottom: 3,
                        paddingTop: 3,
                    },
                }}
                value={selectedBotCollection?.id ?? ''}
                variant="standard"
                onChange={handleBotCollectionChange}
            >
                {getBotCollectionsOptions()}
            </Select>
        </Wrapper>
    );
};

export default BotCollectionComponent;
