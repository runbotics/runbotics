import type { FC } from 'react';

import { useRouter } from 'next/router';
import { FeatureKey } from 'runbotics-common';

import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../utils/LoadingScreen';
import { hasFeatureKeyAccess } from '../utils/Secured';
// eslint-disable-next-line react/display-name
export const withAuthGuard = (Component: FC, featureKeys?: FeatureKey[]) => (props: any) => {
    const { isAuthenticated: isAuthed, isInitialised, user } = useAuth();
    const router = useRouter();
    const isBrowser = typeof window !== 'undefined';
    const isAuthenticated = isInitialised && isBrowser && isAuthed;
    if (!isAuthenticated){
        router.replace('/');
    };
    if (isAuthenticated) {
        if (!featureKeys || hasFeatureKeyAccess(user, featureKeys)){
            return <Component {...props} />;
        }
        router.replace('/404');
    }
    return <LoadingScreen />;
};

export default withAuthGuard;
