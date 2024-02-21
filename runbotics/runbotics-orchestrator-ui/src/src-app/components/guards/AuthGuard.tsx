import { FC } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { COLLECTION_ID_PARAM, FeatureKey, Role } from 'runbotics-common';

import { useDispatch, useSelector } from '#src-app/store';
import { authActions } from '#src-app/store/slices/Auth';
import { processActions, processSelector } from '#src-app/store/slices/Process';
import { processCollectionActions } from '#src-app/store/slices/ProcessCollection';
import { ROOT_PROCESS_COLLECTION_ID } from '#src-app/views/process/ProcessCollectionView/ProcessCollection.utils';

import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../utils/LoadingScreen';
import { AccessUtility, hasFeatureKeyAccess, hasRoleAccess } from '../utils/Secured';

const BUILD_VIEW_REGEX = /\/app\/processes\/[0-9]+\/build$/;
const PROCESS_COLLECTION_REGEX = /\/app\/processes\/collections/;

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
    const isAuthenticated = isInitialized && isBrowser && isAuthed;
    const collectionId: string = useSearchParams().get(COLLECTION_ID_PARAM) ?? ROOT_PROCESS_COLLECTION_ID;

    if (!isAuthenticated) {
        router.replace('/');
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
                                router.replace('/');
                            });
                    });
            }
            return <LoadingScreen />;
        }

        if (PROCESS_COLLECTION_REGEX.test(router.asPath)) {
            const params = collectionId !== null ? {
                filter: { equals: { parentId: collectionId } }
            } : {};

            dispatch(processCollectionActions.getWithAccess(params))
                .then(unwrapResult)
                .catch(() => {
                    router.replace('/404');
                });
        }

        if (
            hasFeatureKeyAccess(user, featureKeys ? featureKeys : [], options)
            && hasRoleAccess(user, userRoles ? userRoles : [])
        ) { return <Component {...props} />; }

        router.replace('/404');
    }

    return <LoadingScreen />;
};

export default withAuthGuard;
