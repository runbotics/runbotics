import type { FC } from 'react';
import useAuth from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import LoadingScreen from '../utils/LoadingScreen';
import { FeatureKey } from 'runbotics-common';
import { hasFeatureKeyAccess } from '../utils/Secured';

// eslint-disable-next-line react/display-name
export const withAuthGuard = (Component: FC, featureKeys?: FeatureKey[]) => (props: any) => {
    const { isAuthenticated, isInitialised, user } = useAuth();
    const router = useRouter();
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser && isInitialised && !isAuthenticated) router.replace('/login');

    if (isBrowser && isInitialised && isAuthenticated) {
        if (!featureKeys || hasFeatureKeyAccess(user, featureKeys)) return <Component {...props} />;

        router.replace('/404');
    }

    return <LoadingScreen />;
};
