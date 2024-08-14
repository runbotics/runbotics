import { User } from '#src-app/types/user';

import { EditCredentialsCollectionDto } from '../CredentialsCollection.types';

export interface EditCredentialsCollectionProps {
    collection: null | EditCredentialsCollectionDto;
    user: User;
    onSubmit: () => void;
}
