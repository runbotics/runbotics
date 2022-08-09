import React from 'react';
import type { FC, ReactNode } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import { hasAuthorities } from '../utils/Secured';

interface DevAdminGuardProps {
    children?: ReactNode;
}

const DevAdminGuard: FC<DevAdminGuardProps> = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        localStorage.setItem('last_page', location.pathname);
        return <Redirect to="/login" />;
    }
    if (!hasAuthorities(user, ['ROLE_ADMIN_DEV'])) {
        return <Redirect to="/404" />;
    }

    return <>{children}</>;
};

export default DevAdminGuard;
