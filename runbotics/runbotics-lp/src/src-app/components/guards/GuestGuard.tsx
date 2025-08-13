import { useEffect, ComponentType } from 'react';

import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import { Role } from 'runbotics-common';

// eslint-disable-next-line react/display-name
export const withGuestGuard = <P extends {}>(Component: ComponentType<P>) => (props: P) => {
    const _router = useRouter();
    const isBrowser = typeof window !== 'undefined';

    useEffect(() => {
        if (!isBrowser) return;

        const accessToken = window.localStorage.getItem('access_token');
        if (!accessToken) return;

        try {
            const decoded: any = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp <= currentTime) return;

            const hasAdminRole = decoded.auth?.includes?.(Role.ROLE_ADMIN) || 
                               decoded.authorities?.includes?.(Role.ROLE_ADMIN) ||
                               decoded.roles?.includes?.(Role.ROLE_ADMIN);
            
            if (hasAdminRole) {
                window.location.href = '/ui/app/tenants';
            } else {
                window.location.href = '/ui/app/processes/collections';
            }
        } catch (error) {
            window.localStorage.removeItem('access_token');
        }
    }, [isBrowser]);

    return <Component {...props} />;
};
