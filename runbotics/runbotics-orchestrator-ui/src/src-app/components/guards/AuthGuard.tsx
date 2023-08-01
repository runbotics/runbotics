import { FC } from 'react';

import { useRouter } from 'next/router';
import { FeatureKey, Role } from 'runbotics-common';

import { useSelector } from '#src-app/store';
import { processSelector } from '#src-app/store/slices/Process';

import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../utils/LoadingScreen';
import { AccessUtility, hasFeatureKeyAccess, hasRoleAccess } from '../utils/Secured';

const buildViewRegex = /\/app\/processes\/[0-9]+\/build$/;

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
    const isBrowser = typeof window !== 'undefined';
    const isAuthenticated = isInitialized && isBrowser && isAuthed;

    if (!isAuthenticated) {
        router.replace('/');
    }

    if (isAuthenticated) {
        if (user.roles.includes(Role.ROLE_GUEST) && !buildViewRegex.test(router.asPath)) {
            if (draft.process?.id) {
                router.replace(`/app/processes/${draft.process.id}/build`);
            }
            return <LoadingScreen />;
        }

        if (!featureKeys || hasFeatureKeyAccess(user, featureKeys, options) || userRoles?.length && hasRoleAccess(user, userRoles)) {
            return <Component {...props} />;
        }

        router.replace('/404');
    }

    return <LoadingScreen />;
};

export default withAuthGuard;
