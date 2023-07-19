import jwtDecode from 'jwt-decode';

import { GuestsState } from './Guests.state';

export const getRemainingSessionTime = (state: GuestsState) => {
    const accessToken = window.localStorage.getItem('access_token');

    if (accessToken) {
        const { exp: expirationTime }: any = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        const isValidToken = expirationTime > currentTime;

        if (isValidToken) {
            const remainingTime = Math.round(expirationTime - currentTime);
            state.remainingSessionTime = remainingTime;
        }
    }
};
