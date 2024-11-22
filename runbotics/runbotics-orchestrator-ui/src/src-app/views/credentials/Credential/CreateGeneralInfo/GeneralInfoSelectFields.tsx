import { Dispatch, FC, SetStateAction, useMemo } from 'react';

import { Grid, SelectChangeEvent } from '@mui/material';

import { PrivilegeType } from 'runbotics-common';

import useAuth from '#src-app/hooks/useAuth';

import { useSelector } from '#src-app/store';

import { credentialCollectionsSelector } from '#src-app/store/slices/CredentialCollections';

import { CollectionDropdown } from './CollectionDropdown';
import { TemplateDropdown } from './TemplateDropdown';
import { CreateCredentialDto } from '../Credential.types';
import { CredentialFormValidationState, inputErrorMessages } from '../EditCredential/EditCredential.utils';


interface GeneralInfoSelectFieldsProps {
    collectionId: string | null;
    credentialFormState: CreateCredentialDto;
    setCredentialFormState: Dispatch<SetStateAction<CreateCredentialDto>>;
    formValidationState: CredentialFormValidationState;
    setFormValidationState: Dispatch<SetStateAction<CredentialFormValidationState>>;
}

export const GeneralInfoSelectFields: FC<GeneralInfoSelectFieldsProps> = ({
    collectionId,
    credentialFormState,
    setCredentialFormState,
    formValidationState,
    setFormValidationState
}) => {
    const { user: currentUser } = useAuth();
    const { credentialCollections } = useSelector(credentialCollectionsSelector);
    const availableCredentialCollections = useMemo(() => credentialCollections
        ?.filter(collection => collection.credentialCollectionUser
            .find(collectionUser => collectionUser.userId === currentUser.id
            && collectionUser.privilegeType === PrivilegeType.WRITE
            )
        ), [credentialCollections, currentUser.id]);

    const handleDropdownChange = (name: string, value: string) => {
        const changeTo = (() => {
            if (name === 'collectionId') {
                const foundCollection = credentialCollections.find(collection => collection.id === value);
                return foundCollection ? foundCollection.id : value;
            }
            return value;
        })();

        setCredentialFormState(prevState => ({
            ...prevState,
            [name]: changeTo
        }));
        setFormValidationState(prevState => ({
            ...prevState,
            [name]: changeTo !== ''
        }));
    };

    return (
        <>
            <Grid item xs={12} mt={2}>
                <CollectionDropdown
                    disabled={!!collectionId}
                    credentialCollections={availableCredentialCollections}
                    selectedValue={credentialFormState.collectionId}
                    handleChange={(event: SelectChangeEvent) => handleDropdownChange('collectionId', event.target.value)}
                    error={formValidationState.edited && !formValidationState.collectionId}
                    helperText={formValidationState.edited && inputErrorMessages.COLLECTION_IS_REQUIRED}
                />
            </Grid>
            <Grid item xs={12}>
                <TemplateDropdown
                    selectedValue={credentialFormState.templateId}
                    handleChange={(event: SelectChangeEvent) => handleDropdownChange('templateId', event.target.value)}
                    error={formValidationState.edited && !formValidationState.templateId}
                    helperText={formValidationState.edited && inputErrorMessages.TEMPLATE_IS_REQUIRED}
                />
            </Grid>
        </>
    );
};
