import { withGuestGuard } from '#src-app/components/guards/GuestGuard';
import LoginPage from '#src-app/views/auth/LoginPage';

export default withGuestGuard(LoginPage);
