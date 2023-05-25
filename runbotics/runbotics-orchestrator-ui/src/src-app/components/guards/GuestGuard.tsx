import type { FC, VFC } from 'react';

import { useRouter } from 'next/router';

import useAuth from '#src-app/hooks/useAuth';

import BlankPage from '#src-app/utils/BlankPage';



// eslint-disable-next-line react/display-name
export const withGuestGuard = (Component: FC | VFC) => (props: any) => {
    const { isAuthenticated, isInitialised } = useAuth();
    const router = useRouter();
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser && isInitialised && isAuthenticated) router.replace('/app');

    if (isBrowser && isInitialised && !isAuthenticated) return <Component {...props} />;

    return <BlankPage />;
};
