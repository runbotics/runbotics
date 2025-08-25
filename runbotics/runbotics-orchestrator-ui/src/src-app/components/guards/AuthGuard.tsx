import { FC } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { FeatureKey, Role } from 'runbotics-common';

import { useDispatch, useSelector } from '#src-app/store';
import { authActions } from '#src-app/store/slices/Auth';
import { setAccessToken } from '#src-app/store/slices/Auth/Auth.thunks';
import { processActions, processSelector } from '#src-app/store/slices/Process';
import { redirectToWebsiteRoot } from '#src-app/utils/navigation';

import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../utils/LoadingScreen';
import { AccessUtility, hasFeatureKeyAccess, hasRoleAccess } from '../utils/Secured';

const BUILD_VIEW_REGEX = /\/app\/processes\/[0-9]+\/build$/;

interface AuthGuardParams {
    Component: FC,
    featureKeys?: FeatureKey[],
    userRoles?: Role[],
    options?: AccessUtility
}

export const withAuthGuard = ({
    Component,
    featureKeys,
    userRoles,
    options
    // eslint-disable-next-line react/display-name
}: AuthGuardParams) => (props: any) => {
    const { isAuthenticated: isAuthed, isInitialized, user } = useAuth();
    const { draft } = useSelector(processSelector);
    const router = useRouter();
    const dispatch = useDispatch();
    const isBrowser = typeof window !== 'undefined';
    
    const hasValidToken = isBrowser && window.localStorage.getItem('access_token');
    const isAuthenticated = isInitialized && isBrowser && isAuthed && hasValidToken;

    if (!isAuthenticated) {
        setAccessToken(null);
        redirectToWebsiteRoot(router.locale);
        return <LoadingScreen />;
    }

    if (isAuthenticated) {
        if (user.roles.includes(Role.ROLE_GUEST) && !BUILD_VIEW_REGEX.test(router.asPath)) {
            if (draft.process?.id) {
                router.replace(`/app/processes/${draft.process.id}/build`);
            } else {
                dispatch(processActions.fetchGuestDemoProcess())
                    .then(unwrapResult)
                    .then((process) => {
                        router.replace(`/app/processes/${process.id}/build`);
                    })
                    .catch(() => {
                        dispatch(authActions.logout())
                            .then(() => {
                                redirectToWebsiteRoot(user.langKey);
                            });
                    });
            }
            return <LoadingScreen />;
        }

        if (
            hasFeatureKeyAccess(user, featureKeys ? featureKeys : [], options)
            && hasRoleAccess(user, userRoles ? userRoles : [])
        ) { return <Component {...props} />; }

        router.replace('/');
    }

    return <LoadingScreen />;
};

export default withAuthGuard;
