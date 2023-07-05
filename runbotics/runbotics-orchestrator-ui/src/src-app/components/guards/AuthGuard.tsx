import type { FC } from 'react';

import { useRouter } from 'next/router';
import { FeatureKey, Role } from 'runbotics-common';


import { useDispatch } from '#src-app/store';

import { authActions } from '#src-app/store/slices/Auth';

import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../utils/LoadingScreen';
import { AccessUtility, hasFeatureKeyAccess } from '../utils/Secured';

const buildViewRegex = /^\/app\/processes\/[0-9]+\/build$/;

// eslint-disable-next-line react/display-name
export const withAuthGuard = (Component: FC, featureKeys?: FeatureKey[], options?: AccessUtility) => (props: any) => {
    const { isAuthenticated: isAuthed, isInitialised, user } = useAuth();
    const dispatch = useDispatch();
    const router = useRouter();
    const isBrowser = typeof window !== 'undefined';
    const isAuthenticated = isInitialised && isBrowser && isAuthed;

    if (!isAuthenticated) {
        console.log('Not authenticated');
        router.replace('/');
    }
    
    if (isAuthenticated) {
        if (!featureKeys || hasFeatureKeyAccess(user, featureKeys, options)) {
            return <Component {...props} />; 
        }
        if (!buildViewRegex.test(router.asPath) && user.roles.includes(Role.ROLE_GUEST)) {
            console.log(`Accessing not build page as a guest ${router.asPath} - logout`);
            dispatch(authActions.logout());
        }
        router.replace('/404');
    }

    return <LoadingScreen />;
};

export default withAuthGuard;
