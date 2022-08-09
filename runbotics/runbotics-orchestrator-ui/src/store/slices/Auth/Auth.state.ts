import { User } from 'src/types/user';

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isInitialised: boolean;
}
