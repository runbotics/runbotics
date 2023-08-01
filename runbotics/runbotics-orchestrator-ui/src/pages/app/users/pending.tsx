import { Role } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import UsersBrowseView from '#src-app/views/users/UsersBrowseView/UsersBrowseView';

export default withAuthGuard({ Component: UsersBrowseView, userRoles: [Role.ROLE_ADMIN]});
