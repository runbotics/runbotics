import { withGuestGuard } from 'src/components/guards/GuestGuard';
import LoginPage from 'src/routing/LoginPage';

export default withGuestGuard(LoginPage);
