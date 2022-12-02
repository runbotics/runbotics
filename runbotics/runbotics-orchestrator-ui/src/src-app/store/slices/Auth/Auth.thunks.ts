import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import jwtDecode from 'jwt-decode';

import { User } from '#src-app/types/user';

const setAccessToken = (accessToken: string | null): void => {
    if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        Axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        localStorage.removeItem('access_token');
        delete Axios.defaults.headers.common.Authorization;
    }
};

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
    const response = await Axios.post<{ id_token: string }>('/api/authenticate', {
        username: payload.email,
        password: payload.password,
        rememberMe: true,
    });
    const { id_token: idToken } = response.data;

    setAccessToken(idToken);
    const responseUser = await Axios.get<User>('/api/account');
    const user = responseUser.data;
    return { ...user, authoritiesById: user?.roles };
});

export const logout = createAsyncThunk('auth/logout', () => {
    setAccessToken(null);
});

const isValidToken = (accessToken: string): boolean => {
    if (!accessToken) { return false; }

    const decoded: any = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
};

export const initialize = createAsyncThunk<{
    isAuthenticated: boolean;
    user: User | null;
}>('auth/initialize', async () => {
    try {
        const accessToken = window.localStorage.getItem('access_token');

        if (accessToken && isValidToken(accessToken)) {
            setAccessToken(accessToken);

            const response = await Axios.get<User>('/api/account');
            const user = response.data;
            return {
                isAuthenticated: true,
                user: { ...user, authoritiesById: user?.roles },
            };
        }
        return {
            isAuthenticated: false,
            user: null,
        };
    } catch (err) {
        return {
            isAuthenticated: false,
            user: null,
        };
    }
});

export const register = createAsyncThunk(
    'auth/register',
    async (payload: { email: string; name: string; password: string }) => {
        await Axios.post('/api/register', {
            email: payload.email,
            login: payload.email,
            langKey: 'pl',
            password: payload.password,
        });
    },
);
