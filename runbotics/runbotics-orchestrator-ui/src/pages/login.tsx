import { withGuestGuard } from '#src-app/components/guards/GuestGuard';
import LoginPage from '#src-app/routing/LoginPage';

export default withGuestGuard(LoginPage);
