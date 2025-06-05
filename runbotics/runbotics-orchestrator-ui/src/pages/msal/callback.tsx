import { withGuestGuard } from '#src-app/components/guards/GuestGuard';
import MsalCallbackPage from '#src-app/views/auth/MsalCallback/MsalCallback.page';

export default withGuestGuard(MsalCallbackPage);
