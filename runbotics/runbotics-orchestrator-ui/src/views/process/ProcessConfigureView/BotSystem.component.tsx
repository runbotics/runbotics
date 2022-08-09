import React, { VFC, ChangeEvent } from 'react';
import DevicesIcon from '@mui/icons-material/Devices';
import { MenuItem, Select } from '@mui/material';
import { useSelector } from 'src/store';
import { capitalizeFirstLetter } from 'src/utils/text';
import { IBotSystem } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';
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

    const getBotSystemOptions = () => Object.values(botSystems)
        .map((system) => (
            <MenuItem value={system.name} key={system.name}>
                {capitalizeFirstLetter(system.name)}
            </MenuItem>
        ));

    const handleBotSystemChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selected = botSystems.find((system) => event.target.value === system.name);
        onSelectBotSystem?.(selected);
    };

    return (
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
            >
                {getBotSystemOptions()}
            </Select>
        </Wrapper>
    );
};

export default BotSystemComponent;
