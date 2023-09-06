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
    formState: IProcess;
    setFormState: (IProcess) => void;
    formValidationState: FormValidationState;
    setFormValidationState: (FormValidationState) => void;
}

interface FormSelectFieldsProps {
    formState: IProcess;
    setFormState: (IProcess) => void;
}

export const EditProcessDialogTextFields: FC<FormTextFieldsProps> = ({
    formState,
    setFormState,
    formValidationState,
    setFormValidationState
}) => {
    const { translate } = useTranslations();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
        if (name === 'name') {
            setFormValidationState((prevState) =>
                ({ ...prevState, name: (value.trim() !== '' ) })
            );
        }
    };

    return (
        <>
            <TextField
                fullWidth
                margin="normal"
                name="name"
                label={translate('Process.Edit.Form.Fields.Name.Label')}
                onChange={handleInputChange}
                value={formState?.name}
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
                value={formState?.description}
                variant="outlined"
            />
        </>
    );
};

export const EditProcessDialogSelectFields: FC<FormSelectFieldsProps> = ({
    formState,
    setFormState
}) => {
    const { translate } = useTranslations();

    return(
        <>
            <Box display="flex" justifyContent="space-between">
                <BotCollectionComponent
                    selectedBotCollection={formState?.botCollection}
                    onSelectBotCollection={(botCollection) => setFormState(prevState => ({ ...prevState, botCollection }))}
                />
                <BotSystemComponent
                    selectedBotSystem={formState?.system}
                    onSelectBotSystem={(system) => setFormState(prevState => ({ ...prevState, system }))}
                />
            </Box>
            <FormControlLabel
                control={(
                    <Switch
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFormState((prevState) => ({ ...prevState, isPublic: e.target.checked }));
                        }}
                        checked={formState?.isPublic ?? false}
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
