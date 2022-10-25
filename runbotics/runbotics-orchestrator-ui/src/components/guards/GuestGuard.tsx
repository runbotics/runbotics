import type { FC } from 'react';
import useAuth from 'src/hooks/useAuth';
import { useRouter } from 'next/router';
import LoadingScreen from '../utils/LoadingScreen';

export const withGuestGuard = (Component: FC) => (props: any) => {
    const { isAuthenticated, isInitialised, user } = useAuth();
    const router = useRouter();
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser && isInitialised && isAuthenticated) {
        router.replace('/app');
    }

    if (isBrowser && isInitialised && !isAuthenticated) {
        return <Component {...props} />;
    }

    return <LoadingScreen />;
};
