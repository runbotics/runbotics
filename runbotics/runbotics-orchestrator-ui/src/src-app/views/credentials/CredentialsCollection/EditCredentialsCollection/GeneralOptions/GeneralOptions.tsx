import { ChangeEvent, FC } from 'react';

import { Box, TextField } from '@mui/material';

import Accordion from '#src-app/components/Accordion';

import useTranslations from '#src-app/hooks/useTranslations';

import { CredentalsCollectionGeneralOptionsProps } from './GeneralOptions.types';
import { BasicCredentialsCollectionDto, CredentialsCollectionKeys } from '../../CredentialsCollection.types';
import CollectionColorSelect from '../CollectionColor/CollectionColorSelect';
import { inputErrorMessages } from '../EditCredentialsCollection.utils';

export const GeneralOptions: FC<CredentalsCollectionGeneralOptionsProps> = ({credentialsCollectionData, formValidationState, inputErrorType, setCredentialsCollectionData}) => {
    const { translate } = useTranslations();

    const handleFormPropertyChange = <Key extends CredentialsCollectionKeys>(
        propertyName: Key,
        value: Partial<BasicCredentialsCollectionDto[Key]>
    ) => setCredentialsCollectionData({ ...credentialsCollectionData, [propertyName]: value });

    return (
        <Accordion title={translate('Credential.Form.Fields.General.Label')} defaultExpanded>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    fullWidth
                    name="name"
                    label={translate('Credential.Form.Fields.Name.Label')}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormPropertyChange('name', e.target.value)}
                    value={credentialsCollectionData.name}
                    variant="outlined"
                    error={!formValidationState}
                    {...(!formValidationState && { helperText: translate('Credential.Add.Form.Error.NameIsRequired') })}
                    InputLabelProps={{ shrink: true }}
                    required
                    helperText={inputErrorMessages[inputErrorType]}
                />
                <TextField
                    fullWidth
                    label={translate('Credentials.Collection.Edit.Description.Label')}
                    name="description"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormPropertyChange('description', e.target.value)}
                    value={credentialsCollectionData.description ?? ''}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                />
                <CollectionColorSelect currentColor={credentialsCollectionData.color} credentialsCollectionData={credentialsCollectionData} setCredentialCollectionColor={setCredentialsCollectionData}/>
            </Box>
        </Accordion>
    );
};
