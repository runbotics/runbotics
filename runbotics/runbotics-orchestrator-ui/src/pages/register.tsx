import { withGuestGuard, withGuestGuardSSR } from '#src-app/components/guards/GuestGuard';
import RegisterView from '#src-app/views/auth/RegisterView';

export default withGuestGuard(RegisterView);

export const getServerSideProps = withGuestGuardSSR();
