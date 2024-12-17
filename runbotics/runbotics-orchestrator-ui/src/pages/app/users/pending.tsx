import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import UsersBrowseView from '#src-app/views/users/UsersBrowseView/UsersBrowseView';

export default withAuthGuard({ Component: UsersBrowseView, featureKeys: [FeatureKey.MANAGE_INACTIVE_USERS, FeatureKey.TENANT_EDIT_USER], options: { oneOf: true } });
