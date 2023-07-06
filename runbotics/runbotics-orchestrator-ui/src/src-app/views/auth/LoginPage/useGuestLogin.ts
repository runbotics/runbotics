import { unwrapResult } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { authActions } from '#src-app/store/slices/Auth';
import { processActions } from '#src-app/store/slices/Process';
import { ProcessTab } from '#src-app/utils/process-tab';

const useGuestLogin = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();

    const handleGuestLogin = () => dispatch(authActions.createGuestAccount({ langKey: router.locale }))
        .then(unwrapResult)
        .then(() => dispatch(processActions.createGuestProcess())
            .then(unwrapResult)
            .then((processResponse) => {
                router.replace(`/app/processes/${processResponse.id}/${ProcessTab.BUILD}`);
            })
        )
        .catch((response: AxiosResponse) => {
            if (response.status === 403) {
                enqueueSnackbar(translate('Login.Guest.LimitExceeded'), {
                    variant: 'error', autoHideDuration: 10000,
                });
            } else {
                enqueueSnackbar(translate('Login.Guest.UnexpectedError'), {
                    variant: 'error', autoHideDuration: 10000,
                });
            }
            return Promise.reject();
        });

    return handleGuestLogin;
};

export default useGuestLogin;
