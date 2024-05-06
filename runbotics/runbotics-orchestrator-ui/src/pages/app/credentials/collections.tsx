import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import CredentialsCollectionsView from '#src-app/views/credentials/CredenitalsCollection/CredentialsCollectionsView';

export default withAuthGuard({ Component: CredentialsCollectionsView, featureKeys: [FeatureKey.CREDENTIALS_COLLECTIONS_READ] });
