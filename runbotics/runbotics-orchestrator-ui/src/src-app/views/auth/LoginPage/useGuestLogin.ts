import { unwrapResult } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { authActions } from '#src-app/store/slices/Auth';
import { processActions } from '#src-app/store/slices/Process';
import { SOURCE_PAGE, TRACK_LABEL, USER_TYPE } from '#src-app/utils/Mixpanel/types';
import { recordFailedLogin, recordSuccessfulAuthentication } from '#src-app/utils/Mixpanel/utils';
import { ProcessTab } from '#src-app/utils/process-tab';

import { ERROR_REASON } from '../../../utils/Mixpanel/types';

const useGuestLogin = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();

    const handleGuestLogin = () => {
        router.push({ query: {
            guest: true,
        }});
        return dispatch(authActions.createGuestAccount({ langKey: router.locale }))
            .then(unwrapResult)
            .then((user) => {
                recordSuccessfulAuthentication({
                    identifyBy: user.email,
                    userType: USER_TYPE.GUEST,
                    sourcePage: SOURCE_PAGE.LOGIN,
                    email: user.email,
                    trackLabel: TRACK_LABEL.SUCCESSFUL_LOGIN,
                });
                return dispatch(processActions.createGuestProcess());
            })
            .then(unwrapResult)
            .then((processResponse) => {
                router.replace(`/app/processes/${processResponse.id}/${ProcessTab.BUILD}`);
            })
            .catch((response: AxiosResponse) => {
                if (response.status === 403) {
                    enqueueSnackbar(translate('Login.Guest.LimitExceeded'), {
                        variant: 'error', autoHideDuration: 10000,
                    });
                    recordFailedLogin({
                        trackLabel: TRACK_LABEL.UNSUCCESSFUL_LOGIN,
                        sourcePage: SOURCE_PAGE.LOGIN,
                        userType: USER_TYPE.GUEST,
                        reason: ERROR_REASON.LIMIT_EXCEEDED,
                    });
                } else {
                    enqueueSnackbar(translate('Login.Guest.UnexpectedError'), {
                        variant: 'error', autoHideDuration: 10000,
                    });
                    recordFailedLogin({
                        trackLabel: TRACK_LABEL.UNSUCCESSFUL_LOGIN,
                        sourcePage: SOURCE_PAGE.LOGIN,
                        userType: USER_TYPE.GUEST,
                        reason: ERROR_REASON.UNEXPECTED_ERROR,
                    });
                }
                router.push('/login');
                return Promise.reject();
            });
    };

    return handleGuestLogin;
};

export default useGuestLogin;
