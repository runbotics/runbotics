import React from 'react';
import type { FC, ReactNode } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
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

AuthGuard.propTypes = {
    children: PropTypes.node,
};

export default AuthGuard;
