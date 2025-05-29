import Axios from 'axios';

const TIMEOUT = 1 * 60 * 1000;
Axios.defaults.timeout = TIMEOUT;
Axios.defaults.maxRedirects = 0;

/**
 * @deprecated Instead use RequestService.getExternalAxios
 * 
 * @see RequestService
 */
export const externalAxios = Axios.create({ maxRedirects: 0 });
// orchestratorAxios.defaults.timeout = TIMEOUT
