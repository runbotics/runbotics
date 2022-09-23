import React, { VFC, ChangeEvent, useState, useEffect } from 'react';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { FormControlLabel, Switch } from '@mui/material';
import useTranslations from 'src/hooks/useTranslations';
import { Wrapper } from './BotComponent.styles';

interface ProcessTriggerableProps {
    isProcessTriggerable: boolean;
    onTriggerableChange: (isTriggerable: boolean) => void;
}

const ProcessTriggerableComponent: VFC<ProcessTriggerableProps> = ({ isProcessTriggerable, onTriggerableChange }) => {
    const { translate } = useTranslations();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onTriggerableChange(e.target.checked);
    };

    return (
        <Wrapper>
            <PersonOutlinedIcon />
            <FormControlLabel
                control={<Switch onChange={handleChange} checked={isProcessTriggerable} />}
                label={translate('Process.Edit.Form.Fields.IsTriggerable.Label')}
                labelPlacement="start"
                sx={{ height: '1.75rem' }}
            />
        </Wrapper>
    );
};

export default ProcessTriggerableComponent;
