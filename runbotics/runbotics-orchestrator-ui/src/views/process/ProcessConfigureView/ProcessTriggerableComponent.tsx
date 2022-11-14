import React, {
    VFC, ChangeEvent,
} from 'react';

import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { FormControlLabel, Switch } from '@mui/material';

import { FeatureKey } from 'runbotics-common';

import If from 'src/components/utils/If';
import useFeatureKey from 'src/hooks/useFeatureKey';
import useTranslations from 'src/hooks/useTranslations';

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
                <PersonOutlinedIcon />
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
