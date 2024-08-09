import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import EditCredential from '#src-app/views/credentials/Credential/EditCredential/EditCredential';

export default withAuthGuard({ Component: EditCredential, featureKeys: [FeatureKey.CREDENTIALS_PAGE_READ] });
