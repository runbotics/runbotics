import { User } from '#src-app/types/user';

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isInitialised: boolean;
}
