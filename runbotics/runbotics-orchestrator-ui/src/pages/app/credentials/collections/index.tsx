import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import CredentialCollectionsGridView from '#src-app/views/credentials/GridView/CredentialCollectionsGridView/CredentialCollectionsGridView';

export default withAuthGuard({ Component: CredentialCollectionsGridView, featureKeys: [FeatureKey.CREDENTIALS_PAGE_READ] });
