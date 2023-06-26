import { withGuestGuard } from '#src-app/components/guards/GuestGuard';
import RegisterPage from '#src-app/views/auth/RegisterPage';

export default withGuestGuard(RegisterPage);
