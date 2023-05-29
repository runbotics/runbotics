import { FC, VFC, useEffect } from 'react';

import { useRouter } from 'next/router';


import useAuth from '#src-app/hooks/useAuth';

import useTranslations from '#src-app/hooks/useTranslations';
import { Language } from '#src-app/translations/translations';

import BlankPage from '#src-app/utils/BlankPage';



// eslint-disable-next-line react/display-name
export const withGuestGuard = (Component: FC | VFC) => (props: any) => {
    const { isAuthenticated, isInitialised } = useAuth();
    const router = useRouter();
    const isBrowser = typeof window !== 'undefined';
    const { switchLanguage } = useTranslations();
    useEffect(() => {
        switchLanguage(router.locale as Language);
    }, [] );

    if (isBrowser && isInitialised && isAuthenticated) router.replace('/app');

    if (isBrowser && isInitialised && !isAuthenticated) return <Component {...props} />;

    return <BlankPage />;
};
