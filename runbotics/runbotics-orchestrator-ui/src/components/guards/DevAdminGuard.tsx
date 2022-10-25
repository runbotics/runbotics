import type { FC } from 'react';
import useAuth from 'src/hooks/useAuth';
import { hasAuthorities } from '../utils/Secured';
import { useRouter } from 'next/router';
import LoadingScreen from '../utils/LoadingScreen';

export const withDevAdminGuard = (Component: FC) => (props: any) => {
    const { isAuthenticated, isInitialised, user } = useAuth();
    const router = useRouter();
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser && isInitialised && !isAuthenticated) {
        router.replace('/login');
    }

    if (isBrowser && isInitialised && isAuthenticated) {
        if (!hasAuthorities(user, ['ROLE_ADMIN_DEV'])) {
            router.replace('/404');
        }
        return <Component {...props} />;
    }

    return <LoadingScreen />;
};
