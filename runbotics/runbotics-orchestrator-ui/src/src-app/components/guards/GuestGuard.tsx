import type { FC } from 'react';

import type { GetServerSidePropsContext, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import useAuth from '#src-app/hooks/useAuth';
import { AUTH_COOKIE_NAME } from '#src-app/utils/constants';

// eslint-disable-next-line react/display-name, complexity
export const withGuestGuard = (Component: FC) => (props: any) => {
    const { isAuthenticated, isInitialised } = useAuth();
    const router = useRouter();
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser && isInitialised && isAuthenticated) router.replace('/app');

    return <Component {...props} />;
};

export const withGuestGuardSSR = (getServerSidePropsFn?: GetServerSideProps) => (ctx: GetServerSidePropsContext) => {
    const token = ctx.req.cookies?.[AUTH_COOKIE_NAME];
    if (token) {
        // Here we can add auth check if token is still valid
        return {
            redirect: {
                permanent: false,
                destination: '/app',
            }
        };
    }

    return getServerSidePropsFn?.(ctx) || {
        props: {}
    };
};
