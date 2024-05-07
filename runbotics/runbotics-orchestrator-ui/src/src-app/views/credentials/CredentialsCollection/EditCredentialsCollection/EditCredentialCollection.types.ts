import { EditCredentialsCollectionDto } from '../CredentialsCollection.types';

export interface EditCredentialsCollectionProps {
    collection: null | EditCredentialsCollectionDto;
    onSubmit: () => void;
}
