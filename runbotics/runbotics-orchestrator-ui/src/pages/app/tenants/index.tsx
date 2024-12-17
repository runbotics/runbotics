import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import TenantsBrowseView from '#src-app/views/tenants/TenantsBrowseView';

export default withAuthGuard({ Component: TenantsBrowseView, featureKeys: [FeatureKey.MANAGE_ALL_TENANTS]  });
