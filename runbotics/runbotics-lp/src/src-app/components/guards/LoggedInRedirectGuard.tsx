import { useEffect, ComponentType } from 'react';

import jwtDecode from 'jwt-decode';
import { Role } from 'runbotics-common';

import { useLocalizedUrl } from '../../hooks/useLocalization';

// eslint-disable-next-line react/display-name
export const withLoggedInRedirectGuard = <P extends {}>(Component: ComponentType<P>) => (props: P) => {
    const isBrowser = typeof window !== 'undefined';
    const { getLocalizedUrl } = useLocalizedUrl();

    useEffect(() => {
        if (!isBrowser) return;

        const accessToken = window.localStorage.getItem('access_token');
        if (!accessToken) return;
        try {
            const decoded: any = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;

            if (decoded.exp <= currentTime) {
                // Token expired
                window.localStorage.removeItem('access_token');
                window.location.href = getLocalizedUrl('/login');
                return;
            }

            const hasAdminRole = decoded.auth?.includes?.(Role.ROLE_ADMIN) ||
                decoded.authorities?.includes?.(Role.ROLE_ADMIN) ||
                decoded.roles?.includes?.(Role.ROLE_ADMIN);

            if (hasAdminRole) {
                window.location.href = getLocalizedUrl('/app/tenants');
            } else {
                window.location.href = getLocalizedUrl('/app/processes/collections');
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Token decoding filed', error);
            window.localStorage.removeItem('access_token');
        }
    }, [isBrowser, getLocalizedUrl]);

    return <Component {...props} />;
};
