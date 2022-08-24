import React from 'react';
import type { FC, ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';

interface GuestGuardProps {
    children?: ReactNode;
}

const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        const lastPage = localStorage.getItem('last_page');
        if (lastPage) {
            return <Redirect to={lastPage} />;
        }
        return <Redirect to="/app/account" />;
    }

    return <>{children}</>;
};

GuestGuard.propTypes = {
    children: PropTypes.node,
};

export default GuestGuard;
