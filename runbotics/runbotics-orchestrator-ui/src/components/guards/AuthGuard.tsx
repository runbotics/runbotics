import React from 'react';
import type { FC, ReactNode } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface AuthGuardProps {
    children?: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        localStorage.setItem('last_page', location.pathname);
        return <Redirect to="/login" />;
    }

    return <>{children}</>;
};

export default AuthGuard;
