import React, { VFC, ChangeEvent } from 'react';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { MenuItem, Select } from '@mui/material';
import { useSelector } from 'src/store';
import { botCollectionSelector } from 'src/store/slices/BotCollections';
import useFeatureKey from 'src/hooks/useFeatureKey';
import { FeatureKey, IBotCollection } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';
import If from 'src/components/utils/If';
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
    const hasReadBotCollectionAccess = useFeatureKey([FeatureKey.PROCESS_BOT_COLLECTION_READ]);
    const hasEditBotCollectionAccess = useFeatureKey([FeatureKey.PROCESS_BOT_COLLECTION_EDIT]);

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
        <If condition={hasReadBotCollectionAccess}>
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
                    disabled={!hasEditBotCollectionAccess}
                >
                    {getBotCollectionsOptions()}
                </Select>
            </Wrapper>
        </If>
    );
};

export default BotCollectionComponent;
