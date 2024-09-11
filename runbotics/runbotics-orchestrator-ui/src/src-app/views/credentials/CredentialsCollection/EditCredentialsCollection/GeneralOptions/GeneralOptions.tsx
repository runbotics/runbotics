import { ChangeEvent, FC } from 'react';

import { Box, TextField } from '@mui/material';

import Accordion from '#src-app/components/Accordion';

import useTranslations from '#src-app/hooks/useTranslations';

import { BasicCredentialsCollectionDto, CredentialsCollectionKeys, EditCredentialsCollectionDto } from '../../CredentialsCollection.types';
import CollectionColorSelect from '../CollectionColor/CollectionColorSelect';
import { inputErrorMessages, InputErrorType } from '../EditCredentialsCollection.utils';

interface CredentalsCollectionGeneralOptionsProps {
    formValidationState: boolean;
    setFormValidationState: (formValidationState: boolean) => void;
    inputErrorType: InputErrorType;
    setInputErrorType: (errorType: InputErrorType) => void;
    formState: EditCredentialsCollectionDto;
    setFormState: (newState: EditCredentialsCollectionDto) => void;
}

export const GeneralOptions: FC<CredentalsCollectionGeneralOptionsProps> = ({
    formValidationState,
    setFormValidationState,
    inputErrorType,
    setInputErrorType,
    formState,
    setFormState
}) => {
    const { translate } = useTranslations();

    const handleFormPropertyChange = <Key extends CredentialsCollectionKeys>(
        propertyName: Key,
        value: Partial<BasicCredentialsCollectionDto[Key]>
    ) => {
        if (propertyName === 'name' && !value.length) {
            setFormValidationState(false);
            setInputErrorType(InputErrorType.NAME_IS_REQUIRED);
        }
        if (propertyName === 'name' && value.length) {
            setFormValidationState(true);
            setInputErrorType(null);
        }
        setFormState({ ...formState, [propertyName]: value });
    };

    return (
        <Accordion title={translate('Credential.Form.Fields.General.Label')} defaultExpanded>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    fullWidth
                    name="name"
                    label={translate('Credential.Form.Fields.Name.Label')}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormPropertyChange('name', e.target.value)}
                    value={formState.name}
                    variant="outlined"
                    error={!formValidationState}
                    InputLabelProps={{ shrink: true }}
                    required
                    helperText={inputErrorMessages[inputErrorType]}
                />
                <TextField
                    fullWidth
                    label={translate('Credentials.Collection.Edit.Description.Label')}
                    name="description"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormPropertyChange('description', e.target.value)}
                    value={formState.description ?? ''}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                />
                <CollectionColorSelect
                    currentColor={formState.color}
                    credentialsCollectionData={formState}
                    setCredentialCollectionColor={setFormState}
                />
            </Box>
        </Accordion>
    );
};
