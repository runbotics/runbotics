import React, {
    VFC, ChangeEvent,
} from 'react';

import { FormControlLabel, Switch } from '@mui/material';

import Image from 'next/image';
import { FeatureKey } from 'runbotics-common';

import ProcessTriggerableIcon from '#public/images/icons/process_triggerable.svg';


import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';

import { Wrapper } from './BotComponent.styles';


interface ProcessTriggerableProps {
    isProcessTriggerable: boolean;
    onTriggerableChange: (isTriggerable: boolean) => void;
}

const ProcessTriggerableComponent: VFC<ProcessTriggerableProps> = ({ isProcessTriggerable, onTriggerableChange }) => {
    const hasReadProcessTriggerAccess = useFeatureKey([FeatureKey.PROCESS_IS_TRIGGERABLE_READ]);
    const hasEditProcessTriggerAccess = useFeatureKey([FeatureKey.PROCESS_IS_TRIGGERABLE_EDIT]);
    const { translate } = useTranslations();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onTriggerableChange(e.target.checked);
    };

    const attendedSwitch = (
        <Switch
            onChange={handleChange}
            checked={isProcessTriggerable}
            disabled={!hasEditProcessTriggerAccess}
        />
    );

    return (
        <If condition={hasReadProcessTriggerAccess}>
            <Wrapper>
                <Image
                    height={24}
                    src={ProcessTriggerableIcon}
                    alt={translate('Component.Tile.Process.Configure.Alt.ProcessTriggerableIcon')}
                />
                <FormControlLabel
                    control={attendedSwitch}
                    label={translate('Process.Edit.Form.Fields.IsTriggerable.Label')}
                    labelPlacement="start"
                    sx={{ height: '1.75rem' }}
                />
            </Wrapper>
        </If>
    );
};

export default ProcessTriggerableComponent;
