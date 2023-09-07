import React, { FC } from 'react';

import {
    TextField,
    Switch,
    FormControlLabel,
    Box
} from '@mui/material';
import { IProcess } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';

import { FormValidationState } from './EditProcessDialog';
import BotCollectionComponent from './ProcessConfigureView/BotCollection.component';
import BotSystemComponent from './ProcessConfigureView/BotSystem.component';

interface FormTextFieldsProps {
    processFormState: IProcess;
    setProcessFormState: (IProcess) => void;
    formValidationState: FormValidationState;
    setFormValidationState: (FormValidationState) => void;
}

interface FormSelectFieldsProps {
    processFormState: IProcess;
    setProcessFormState: (IProcess) => void;
}

export const EditProcessDialogTextFields: FC<FormTextFieldsProps> = ({
    processFormState,
    setProcessFormState,
    formValidationState,
    setFormValidationState
}) => {
    const { translate } = useTranslations();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setProcessFormState((prevState) => ({ ...prevState, [name]: value }));

        if (name !== 'name') return;

        setFormValidationState((prevState) => ({ ...prevState, name: (value.trim() !== '' ) }));
    };

    return (
        <>
            <TextField
                fullWidth
                margin="normal"
                name="name"
                label={translate('Process.Edit.Form.Fields.Name.Label')}
                onChange={handleInputChange}
                value={processFormState?.name}
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
                value={processFormState?.description}
                variant="outlined"
            />
        </>
    );
};

export const EditProcessDialogSelectFields: FC<FormSelectFieldsProps> = ({
    processFormState,
    setProcessFormState
}) => {
    const { translate } = useTranslations();

    return(
        <>
            <Box display="flex" justifyContent="space-between">
                <BotCollectionComponent
                    selectedBotCollection={processFormState?.botCollection}
                    onSelectBotCollection={(botCollection) => setProcessFormState(prevState => ({ ...prevState, botCollection }))}
                />
                <BotSystemComponent
                    selectedBotSystem={processFormState?.system}
                    onSelectBotSystem={(system) => setProcessFormState(prevState => ({ ...prevState, system }))}
                />
            </Box>
            <FormControlLabel
                control={(
                    <Switch
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setProcessFormState((prevState) => ({ ...prevState, isPublic: e.target.checked }));
                        }}
                        checked={processFormState?.isPublic ?? false}
                    />
                )}
                label={translate('Process.Edit.Form.Fields.Public.Label')}
                labelPlacement="start"
                sx={{
                    width: 'fit-content', marginLeft: '0', padding: '0.5rem',
                }}
            />
        </>
    );
};
