import { withGuestGuard } from '#src-app/components/guards/GuestGuard';
import RegisterView from '#src-app/views/auth/RegisterView';

export default withGuestGuard(RegisterView);
