import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import CredentialsView from '#src-app/views/credentials/Credenitals/CredentialsView';

export default withAuthGuard({ Component: CredentialsView, featureKeys: [FeatureKey.CREDENTIALS_READ] });
