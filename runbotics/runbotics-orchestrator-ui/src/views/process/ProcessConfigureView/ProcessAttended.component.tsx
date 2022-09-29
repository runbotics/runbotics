import React, { VFC, ChangeEvent, useState, useEffect } from 'react';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { FormControlLabel, Switch } from '@mui/material';
import useTranslations from 'src/hooks/useTranslations';
import { Wrapper } from './BotComponent.styles';
import If from 'src/components/utils/If';
import useFeatureKey from 'src/hooks/useFeatureKey';
import { FeatureKey } from 'runbotics-common';

interface ProcessAttendedProps {
    isProcessAttended: boolean;
    onAttendedChange: (isAttended: boolean) => void;
}

const ProcessAttendedComponent: VFC<ProcessAttendedProps> = ({ isProcessAttended, onAttendedChange }) => {
    const hasReadIsProcessAttended = useFeatureKey([FeatureKey.PROCESS_IS_ATTENDED_READ]);
    const { translate } = useTranslations();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onAttendedChange(e.target.checked);
    };
    
    return (
        <If condition={hasReadIsProcessAttended}>
            <Wrapper>
                <PersonOutlinedIcon />
                <FormControlLabel
                    control={<Switch onChange={handleChange} checked={isProcessAttended} />}
                    label={translate('Process.Edit.Form.Fields.IsAttended.Label')}
                    labelPlacement="start"
                    sx={{ height: '1.75rem' }}
                    />
            </Wrapper>
        </If>
    );
};

export default ProcessAttendedComponent;
