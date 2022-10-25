import { withGuestGuard } from 'src/components/guards/GuestGuard';
import RegisterView from 'src/views/auth/RegisterView';

export default withGuestGuard(RegisterView);
