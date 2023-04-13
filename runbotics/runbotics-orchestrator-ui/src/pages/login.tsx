import { withGuestGuard, withGuestGuardSSR } from '#src-app/components/guards/GuestGuard';
import LoginPage from '#src-app/routing/LoginPage';

export default withGuestGuard(LoginPage);

export const getServerSideProps = withGuestGuardSSR();
