import axios from 'axios';

import { translate } from '#src-app/hooks/useTranslations';
import { setAccessToken } from '#src-app/store/slices/Auth/Auth.thunks';

export interface AxiosInstanceError {
    data: any;
    status: number;
}

export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => response,
    (error): Promise<AxiosInstanceError> => Promise.reject(
        error.response
            ? {
                data: error.response.data,
                status: error.response.status,
            }
            : {
                data: translate('Common.Errors.Request.GeneralError'),
                status: 400,
            }
    )
);

const axiosApi = axios.create();

axiosApi.interceptors.response.use((res) => res, (err) => {
    if (err.request.status === 401 && !err.request.responseURL.includes('/api/scheduler/auth/authenticate')) {
        setAccessToken(null);
        delete axiosApi.defaults.headers.common.Authorization;
        window.location.reload();
    }

    return Promise.reject(err);
});

export default axiosApi;
