import { createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { MsalLoginError, UserDto } from 'runbotics-common';

import Axios from '#src-app/utils/axios';

import { AuthState } from './Auth.state';

export const setAccessToken = (accessToken: string | null): void => {
    if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        Axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        localStorage.removeItem('access_token');
        delete Axios.defaults.headers.common.Authorization;
    }
};

export const login = createAsyncThunk<
    AuthState['user'],
    { email: string; password: string }
>('auth/login', async (payload, { rejectWithValue }) => {
    try {
        const response = await Axios.post<{ idToken: string; user: UserDto }>(
            '/api/scheduler/auth/authenticate',
            {
                username: payload.email,
                password: payload.password,
                rememberMe: true,
            }
        );
        const { idToken, user } = response.data;

        setAccessToken(idToken);
        // const { data: user } = await Axios.get<UserDto>('/api/account');
        return { ...user, authoritiesById: user?.roles };
    } catch (error) {
        if (!error.response) {
            throw error;
        }

        return rejectWithValue(error.response);
    }
});

export const createGuestAccount = createAsyncThunk<
    UserDto,
    { langKey: string }
>('auth/createGuestAccount', async ({ langKey }, { rejectWithValue }) => {
    try {
        const response = await Axios.post<{ idToken: string; user: UserDto }>(
            '/api/scheduler/auth/authenticate/guest',
            { langKey }
        );
        const token = response.data.idToken;

        setAccessToken(token);
        
        return {
            ...response.data.user,
            authoritiesById: response.data.user?.roles,
        };
    } catch (error) {
        if (!error.response) {
            throw error;
        }

        return rejectWithValue(error.response);
    }
});

export const logout = createAsyncThunk('auth/logout', () => {
    setAccessToken(null);
});

const isValidToken = (accessToken: string): boolean => {
    if (!accessToken) {
        return false;
    }

    const decoded: any = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
};

export const initialize = createAsyncThunk<{
    isAuthenticated: boolean;
    user: UserDto | null;
}>('auth/initialize', async () => {
    try {
        const accessToken = window.localStorage.getItem('access_token');

        if (accessToken && isValidToken(accessToken)) {
            setAccessToken(accessToken);

            const response = await Axios.get<UserDto>(
                '/api/scheduler/users/account'
            );
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
    async (
        payload: {
            email: string;
            name: string;
            password: string;
            langKey: string;
            inviteCode?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await Axios.post('/api/register', {
                email: payload.email,
                login: payload.email,
                langKey: payload.langKey,
                password: payload.password,
                inviteCode: payload.inviteCode,
            });

            return response;
        } catch (error) {
            if (!error.response) {
                throw error;
            }

            return rejectWithValue({
                status: error.response.status,
                message: error.response.statusText,
            });
        }
    }
);

export const loginWithMsalCookie = createAsyncThunk<AuthState['user'], void>(
    'auth/loginWithMsalToken',
    async (_, { rejectWithValue }) => {
        try {
            const idToken = Cookies.get('msal_token_transfer');
            Cookies.remove('msal_token_transfer', { path: '/' });
            if (!idToken) {
                return rejectWithValue(MsalLoginError.BAD_COOKIE);
            }
            setAccessToken(idToken);
            const responseUser = await Axios.get<UserDto>(
                '/api/scheduler/users/account'
            );
            const user = responseUser.data;
            return { ...user, authoritiesById: user?.roles };
        } catch (error) {
            return rejectWithValue(error?.message || 'Unknown error');
        }
    }
);
