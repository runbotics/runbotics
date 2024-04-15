import React, { FC } from 'react';

import {
    Box
} from '@mui/material';

import Accordion from '#src-app/components/Accordion';
import useTranslations from '#src-app/hooks/useTranslations';

import { ConfigureOptionsProps } from './ConfigureOptions.types';
import BotCollectionComponent from '../../ProcessConfigureView/BotCollection.component';
import BotSystemComponent from '../../ProcessConfigureView/BotSystem.component';

const ConfigureOptions: FC<ConfigureOptionsProps> = ({ isEditDialogOpen, isOwner, processData, setProcessData }) => {
    const { translate } = useTranslations();

    return (
        <Accordion
            title={translate('Process.Edit.Form.Fields.Configuration')}
        >
            <Box display="flex" justifyContent="space-between">
                <BotCollectionComponent
                    selectedBotCollection={processData.botCollection}
                    onSelectBotCollection={(botCollection) => setProcessData(prevState => ({ ...prevState, botCollection }))}
                />
                <BotSystemComponent
                    selectedBotSystem={processData.system}
                    onSelectBotSystem={(system) => setProcessData(prevState => ({ ...prevState, system }))}
                />
            </Box>
        </Accordion>
    );
};

export default ConfigureOptions;
