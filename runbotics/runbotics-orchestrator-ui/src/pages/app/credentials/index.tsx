import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import CredentialsGridView from '#src-app/views/credentials/GridView/CredentialsGridView/CredentialsGridView';

export default withAuthGuard({ Component: CredentialsGridView, featureKeys: [FeatureKey.CREDENTIALS_PAGE_READ] });
