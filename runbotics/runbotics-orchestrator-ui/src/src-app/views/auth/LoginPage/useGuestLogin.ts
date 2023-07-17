import { unwrapResult } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import crypto from 'crypto';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { authActions } from '#src-app/store/slices/Auth';
import { processActions } from '#src-app/store/slices/Process';
import { Page, TrackLabel, UserType } from '#src-app/utils/Mixpanel/types';
import { mixpanelRecordFailedLogin, mixpanelRecordSuccessfulLogin } from '#src-app/utils/Mixpanel/utils';
import { ProcessTab } from '#src-app/utils/process-tab';

const useGuestLogin = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();

    const handleGuestLogin = () => dispatch(authActions.createGuestAccount({ langKey: router.locale }))
        .then(unwrapResult)
        .then((user) => {
            mixpanelRecordSuccessfulLogin({
                identifyBy: user.email,
                userType: UserType.GUEST,
                page: Page.LOGIN,
                email: user.email,
                userName: 'Guest',
                trackLabel: TrackLabel.SUCCESSFUL_LOGIN,
            });
            return dispatch(processActions.createGuestProcess());
        })
        .then(unwrapResult)
        .then((processResponse) => {
            router.replace(`/app/processes/${processResponse.id}/${ProcessTab.BUILD}`);
        })
        .catch((response: AxiosResponse) => {
            const randomHash = crypto.randomBytes(10).toString('hex');
            if (response.status === 403) {
                enqueueSnackbar(translate('Login.Guest.LimitExceeded'), {
                    variant: 'error', autoHideDuration: 10000,
                });
                mixpanelRecordFailedLogin({
                    identifyBy: randomHash,
                    trackLabel: TrackLabel.UNSUCCESSFUL_LOGIN,
                    page: Page.LOGIN,
                    userType: UserType.GUEST,
                    reason: 'limit exceeded',
                });
            } else {
                enqueueSnackbar(translate('Login.Guest.UnexpectedError'), {
                    variant: 'error', autoHideDuration: 10000,
                });
                mixpanelRecordFailedLogin({
                    identifyBy: randomHash,
                    trackLabel: TrackLabel.UNSUCCESSFUL_LOGIN,
                    page: Page.LOGIN,
                    userType: UserType.GUEST,
                    reason: 'unexpected error',
                });
            }
            return Promise.reject();
        });

    return handleGuestLogin;
};

export default useGuestLogin;
