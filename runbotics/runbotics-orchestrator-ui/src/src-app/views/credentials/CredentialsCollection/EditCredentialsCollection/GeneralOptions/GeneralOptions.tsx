import { Dispatch, ChangeEvent, FC, SetStateAction } from 'react';

import { Box, TextField } from '@mui/material';

import Accordion from '#src-app/components/Accordion';

import useTranslations from '#src-app/hooks/useTranslations';

import { CredentialsCollectionKeys, EditCredentialsCollectionWithCreatorDto } from '../../CredentialsCollection.types';
import CollectionColorSelect from '../CollectionColor/CollectionColorSelect';
import { CollectionFormValidation, inputErrorMessages, InputErrorType } from '../EditCredentialsCollection.utils';

interface CredentalsCollectionGeneralOptionsProps {
    formValidationState: CollectionFormValidation;
    setFormValidationState: Dispatch<SetStateAction<CollectionFormValidation>>;
    inputErrorType: InputErrorType;
    setInputErrorType: Dispatch<SetStateAction<InputErrorType>>;
    formState: EditCredentialsCollectionWithCreatorDto;
    setFormState: Dispatch<SetStateAction<EditCredentialsCollectionWithCreatorDto>>;
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
        value: string
    ) => {
        if (propertyName === 'name' && !value.length) {
            setFormValidationState({
                edited: true,
                name: false
            });
            setInputErrorType(InputErrorType.NAME_IS_REQUIRED);
        }
        if (propertyName === 'name' && value.length) {
            setFormValidationState({
                edited: true,
                name: true
            });
            setInputErrorType(null);
        }
        setFormState((prevFormState) => ({
            ...prevFormState,
            [propertyName]: value
        }));
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
                    error={formValidationState.edited && !formValidationState.name}
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
                    setFormState={setFormState}
                />
            </Box>
        </Accordion>
    );
};
