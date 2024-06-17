import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import jwtDecode from 'jwt-decode';

import { User } from '#src-app/types/user';

export const setAccessToken = (accessToken: string | null): void => {
    if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        Axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        localStorage.removeItem('access_token');
        delete Axios.defaults.headers.common.Authorization;
    }
};

export const getChatAccessToken = async () => {
    const chatAccessToken = window.localStorage.getItem('chat_access_token');
    if (!chatAccessToken || !isValidToken(chatAccessToken)) {
        await Axios
            .get<{ chatAccessToken: string }>('/scheduler/chatbot/GenerateToken')
            .then(res => {
                window.localStorage.setItem('chat_access_token', res.data.chatAccessToken);
            })
            .catch(error => {
                console.error(error.message);

                window.localStorage.removeItem('chat_access_token');
            });
    }
    return window.localStorage.getItem('chat_access_token') ?? '';
};

export const setChatAccessTokenRefresher = (token: string, updateToken: (token: string) => void) => {
    if (!isValidToken(token)) return;

    let decoded: any = jwtDecode(token);
    let expTime = decoded.exp * 1000;
    let currentTime = Date.now();

    let intervalTime = expTime - currentTime;
    let currentInterval;

    const logMessage = async () => {
        console.log(
            'Logging message with interval:',
            intervalTime,
            'ms'
        );

        clearInterval(currentInterval);

        const newToken = await Axios
            .get<{ chatAccessToken: string }>('/scheduler/chatbot/GenerateToken')
            .then(res => {
                window.localStorage.setItem('chat_access_token', res.data.chatAccessToken);
                return res.data.chatAccessToken;
            })
            .catch(error => {
                console.error(error);
                window.localStorage.removeItem('chat_access_token');
                return '';
            });

        updateToken(newToken);
        decoded = jwtDecode(newToken);
        expTime = decoded.exp * 1000;
        currentTime = Date.now();

        intervalTime = intervalTime = expTime - currentTime;

        currentInterval = setInterval(logMessage, intervalTime);
    };

    currentInterval = setInterval(logMessage, intervalTime);
};

export const login = createAsyncThunk(
    'auth/login',
    async (
        payload: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await Axios.post<{ id_token: string }>(
                '/api/authenticate',
                {
                    username: payload.email,
                    password: payload.password,
                    rememberMe: true,
                }
            );
            const { id_token: idToken } = response.data;

            setAccessToken(idToken);
            const responseUser = await Axios.get<User>('/api/account');
            const user = responseUser.data;
            return { ...user, authoritiesById: user?.roles };
        } catch (error) {
            if (!error.response) {
                throw error;
            }

            return rejectWithValue(error.response);
        }
    }
);

export const createGuestAccount = createAsyncThunk<User, { langKey: string }>(
    'auth/createGuestAccount',
    async ({ langKey }, { rejectWithValue }) => {
        try {
            const response = await Axios.post<{ id_token: string }>('/api/authenticate/guest', { langKey });
            const token = response.data.id_token;

            setAccessToken(token);
            const { data: responseUser } = await Axios.get<User>('/api/account');
            return { ...responseUser, authoritiesById: responseUser?.roles };
        } catch (error) {
            if (!error.response) {
                throw error;
            }

            return rejectWithValue(error.response);
        }
    }
);

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
    async (
        payload: { email: string; name: string; password: string, langKey: string, inviteCode?: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await Axios.post('/api/register', {
                email: payload.email,
                login: payload.email,
                langKey: payload.langKey,
                password: payload.password,
                inviteCode: payload.inviteCode
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
