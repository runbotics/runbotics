import { unwrapResult } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { IProcess } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { authActions } from '#src-app/store/slices/Auth';
import { processActions } from '#src-app/store/slices/Process';
import { ProcessTab } from '#src-app/utils/process-tab';
import emptyBpmn from '#src-app/views/process/ProcessBuildView/Modeler/extensions/config/empty.bpmn';

const useGuestLogin = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();

    const handleGuestLogin = () => {

        const process: IProcess = {
            isPublic: false,
            name: 'Demo',
            description: '',
            definition: emptyBpmn
        };

        return dispatch(authActions.createGuestAccount({ langKey: router.locale }))
            .then(unwrapResult)
            .then(() => dispatch(processActions.createProcess(process))
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
    };

    return handleGuestLogin;
};

export default useGuestLogin;
