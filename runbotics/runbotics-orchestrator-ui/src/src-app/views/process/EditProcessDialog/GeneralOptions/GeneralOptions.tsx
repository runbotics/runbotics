import React, { FC } from 'react';

import {
    TextField
} from '@mui/material';

import Accordion from '#src-app/components/Accordion';
import useTranslations from '#src-app/hooks/useTranslations';

import { GeneralOptionsProps } from './GeneralOptions.types';


export const GeneralOptions: FC<GeneralOptionsProps> = ({
    processData,
    setProcessData,
    formValidationState,
    setFormValidationState
}) => {
    const { translate } = useTranslations();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setProcessData((prevState) => ({ ...prevState, [name]: value }));

        if (name !== 'name') return;

        setFormValidationState((prevState) => ({ ...prevState, name: (value.trim() !== '') }));
    };

    return (
        <Accordion title={translate('Process.Edit.Form.Fields.General.Label')}>
            <TextField
                fullWidth
                margin="normal"
                name="name"
                label={translate('Process.Edit.Form.Fields.Name.Label')}
                onChange={handleInputChange}
                value={processData.name}
                variant="outlined"
                error={!formValidationState.name}
                {...(!formValidationState.name && { helperText: translate('Process.Edit.Form.Fields.Error.Required') })}
            />
            <TextField
                fullWidth
                label={translate('Process.Edit.Form.Fields.Description.Label')}
                margin="normal"
                name="description"
                onChange={handleInputChange}
                value={processData.description ?? ''}
                variant="outlined"
            />
        </Accordion>
    );
};

