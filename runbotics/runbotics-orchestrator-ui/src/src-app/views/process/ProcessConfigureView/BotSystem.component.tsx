import React, { VFC, ChangeEvent } from 'react';

import DevicesIcon from '@mui/icons-material/Devices';
import { MenuItem, Select } from '@mui/material';

import { FeatureKey, IBotSystem } from 'runbotics-common';



import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';
import { capitalizeFirstLetter } from '#src-app/utils/text';

import { botSystemsSelector } from '../../../store/slices/BotSystem';
import { Wrapper } from './BotComponent.styles';


interface BotSystemProps {
    selectedBotSystem: IBotSystem;
    onSelectBotSystem?: (botSystem: IBotSystem) => void;
}

const BotSystemComponent: VFC<BotSystemProps> = ({
    selectedBotSystem, onSelectBotSystem,
}) => {
    const { botSystems } = useSelector(botSystemsSelector);
    const { translate } = useTranslations();
    const hasReadBotSystemAccess = useFeatureKey([FeatureKey.PROCESS_BOT_SYSTEM_READ]);
    const hasEditBotSystemAccess = useFeatureKey([FeatureKey.PROCESS_BOT_SYSTEM_EDIT]);

    const getBotSystemOptions = () => Object.values(botSystems)
        .map((system) => (
            <MenuItem value={system.name} key={system.name}>
                {capitalizeFirstLetter({ text: system.name, lowerCaseRest: true })}
            </MenuItem>
        ));

    const handleBotSystemChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selected = botSystems.find((system) => event.target.value === system.name);
        onSelectBotSystem?.(selected);
    };

    return (
        <If condition={hasReadBotSystemAccess}>
            <Wrapper>
                <DevicesIcon />
                {`${translate('Process.Run.BotSystem')}: `}
                <Select
                    style={{ minWidth: '8rem', height: '1.75rem' }}
                    SelectDisplayProps={{
                        style: {
                            paddingBottom: 3,
                            paddingTop: 3,
                        },
                    }}
                    value={selectedBotSystem?.name ?? ''}
                    variant="standard"
                    onChange={handleBotSystemChange}
                    disabled={!hasEditBotSystemAccess}
                >
                    {getBotSystemOptions()}
                </Select>
            </Wrapper>
        </If>
    );
};

export default BotSystemComponent;
