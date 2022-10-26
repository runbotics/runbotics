import type { FC } from 'react';
import useAuth from 'src/hooks/useAuth';
import { useRouter } from 'next/router';
import LoadingScreen from '../utils/LoadingScreen';

// eslint-disable-next-line react/display-name
export const withGuestGuard = (Component: FC) => (props: any) => {
    const { isAuthenticated, isInitialised } = useAuth();
    const router = useRouter();
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser && isInitialised && isAuthenticated) router.replace('/app');

    if (isBrowser && isInitialised && !isAuthenticated) return <Component {...props} />;

    return <LoadingScreen />;
};
