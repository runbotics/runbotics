import { CredentialCollection } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

export interface CredentialCollectionsState {
    allCredentialCollectionsByPage: Page<CredentialCollection>;
    credentialCollections: CredentialCollection[];
    loading: boolean;
}
