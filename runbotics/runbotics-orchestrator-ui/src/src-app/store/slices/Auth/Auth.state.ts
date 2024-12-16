import { Dictionary } from '@reduxjs/toolkit';
import { UserDto } from 'runbotics-common';

export interface AuthState {
    isAuthenticated: boolean;
    user: UserDto & { authoritiesById?: Dictionary<any>; } | null;
    isInitialized: boolean;
}
