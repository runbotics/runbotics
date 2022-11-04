import axios from 'axios';

import { translate } from 'src/hooks/useTranslations';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(
        (error.response && error.response.data) || translate('Common.Errors.Request.GeneralError'),
    ),
);

export default axiosInstance;
