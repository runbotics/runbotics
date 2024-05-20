import { BasicCredentialsCollectionDto, CredenitalsCollectionValues, CredentialsCollectionKeys, CredentialsCollectionUser } from '../../CredentialsCollection.types';

export interface SharedWithOptionsProps {
    collectionData: BasicCredentialsCollectionDto;
    canEdit: boolean;
    isEditDialogOpen: boolean;
    shareableUsers: {
        all: CredentialsCollectionUser[];
        loading: boolean;
    };
    handleChange: (property: CredentialsCollectionKeys, newValue: CredenitalsCollectionValues ) => void;
}
