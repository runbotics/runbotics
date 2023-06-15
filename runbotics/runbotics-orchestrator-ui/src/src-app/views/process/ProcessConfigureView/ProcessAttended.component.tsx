import React, {
    VFC, ChangeEvent,
} from 'react';

import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { FormControlLabel, Switch } from '@mui/material';

import { FeatureKey } from 'runbotics-common';


import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';

import { Wrapper } from './BotComponent.styles';



interface ProcessAttendedProps {
    isProcessAttended: boolean;
    onAttendedChange: (isAttended: boolean) => void;
}

const ProcessAttendedComponent: VFC<ProcessAttendedProps> = ({ isProcessAttended, onAttendedChange }) => {
    const hasReadProcessAttendAccess = useFeatureKey([FeatureKey.PROCESS_IS_ATTENDED_READ]);
    const hasEditProcessAttendAccess = useFeatureKey([FeatureKey.PROCESS_IS_ATTENDED_EDIT]);
    const { process } = useSelector((state) => state.process.draft);
    const isScheduled = process?.schedules.length > 0;
    const { translate } = useTranslations();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onAttendedChange(e.target.checked);
    };

    const attendedSwitch = (
        <Switch
            onChange={handleChange}
            checked={isProcessAttended}
            disabled={!hasEditProcessAttendAccess || isScheduled}
        />
    );

    return (
        <If condition={hasReadProcessAttendAccess}>
            <Wrapper>
                <PersonOutlinedIcon />
                <FormControlLabel
                    control={attendedSwitch}
                    label={translate('Process.Edit.Form.Fields.IsAttended.Label')}
                    labelPlacement="start"
                    sx={{ height: '1.75rem' }}
                />
            </Wrapper>
        </If>
    );
};

export default ProcessAttendedComponent;
