import { CredentialsCollection } from '../CredentialsCollection.types';

export interface EditCredentialsCollectionProps {
    collection: CredentialsCollection;
    onClose: () => void;
    onAdd: (credential: CredentialsCollection) => void;
    open?: boolean;
}
