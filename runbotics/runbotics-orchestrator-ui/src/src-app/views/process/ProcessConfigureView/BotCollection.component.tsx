import React, { VFC, ChangeEvent } from 'react';

import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { MenuItem, Select } from '@mui/material';

import { BotCollectionDto, FeatureKey } from 'runbotics-common';


import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';
import { botCollectionSelector } from '#src-app/store/slices/BotCollections';

import { StyledLabel, Wrapper } from './BotComponent.styles';



interface BotCollectionProps {
    selectedBotCollection: BotCollectionDto;
    onSelectBotCollection?: (collection: BotCollectionDto) => void;
    canConfigure: boolean;
}

const BotCollectionComponent: VFC<BotCollectionProps> = ({
    selectedBotCollection,
    onSelectBotCollection,
    canConfigure
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
                <StyledLabel>
                    {`${translate('Process.Run.BotCollection')}: `}
                </StyledLabel>
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
                    disabled={!hasEditBotCollectionAccess || !canConfigure}
                >
                    {getBotCollectionsOptions()}
                </Select>
            </Wrapper>
        </If>
    );
};

export default BotCollectionComponent;
