import type { FC } from 'react';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FeatureKey, Role } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processSelector } from '#src-app/store/slices/Process';

import StorageManagerService from '#src-app/store/StorageManager.service';

import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../utils/LoadingScreen';
import { AccessUtility, hasFeatureKeyAccess } from '../utils/Secured';


const buildViewRegex = /\/app\/processes\/[0-9]+\/build$/;
const homeAppViewRegex = /\/app\/processes$/;
const appOnlyRegex = /\/app/;

// eslint-disable-next-line react/display-name
export const withAuthGuard = (Component: FC, featureKeys?: FeatureKey[], options?: AccessUtility) => (props: any) => {
    const { isAuthenticated: isAuthed, isInitialised, user } = useAuth();
    const dispatch = useDispatch();
    const { draft } = useSelector(processSelector);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const isBrowser = typeof window !== 'undefined';
    const isAuthenticated = isInitialised && isBrowser && isAuthed;

    if (!isAuthenticated) {
        if (appOnlyRegex.test(router.asPath)) {
            StorageManagerService.insertDestinationPage(router.asPath);
            enqueueSnackbar(translate('Account.SessionExpired'), {
                variant: 'error'
            });
        }
        
        router.replace('/login');
    }
    
    if (isAuthenticated) {
        if (user.roles.includes(Role.ROLE_GUEST) && !buildViewRegex.test(router.asPath)) {
            if (draft.process?.id) {
                router.replace(`/app/processes/${draft.process.id}/build`);
            }
            return <LoadingScreen />;
        }

        if (!featureKeys || hasFeatureKeyAccess(user, featureKeys, options)) {
            return <Component {...props} />; 
        }

        router.replace('/404');
    }

    return <LoadingScreen />;
};

export default withAuthGuard;
