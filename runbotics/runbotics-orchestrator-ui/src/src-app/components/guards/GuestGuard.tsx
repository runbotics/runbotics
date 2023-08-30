import { FC, VFC, useEffect } from 'react';

import { useRouter } from 'next/router';

import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';
import { Language } from '#src-app/translations/translations';
import BlankPage from '#src-app/utils/BlankPage';

// eslint-disable-next-line react/display-name
export const withGuestGuard = (Component: FC | VFC) => (props: any) => {
    const { isAuthenticated, isInitialized, user } = useAuth();
    const router = useRouter();
    const isBrowser = typeof window !== 'undefined';
    const { switchLanguage } = useTranslations();

    useEffect(() => {
        switchLanguage(router.locale as Language);
    }, [router.locale]);

    if (isBrowser && isInitialized && isAuthenticated) router.replace('/app/processes', null, { locale: user.langKey });

    if (isBrowser && isInitialized && !isAuthenticated) return <Component {...props} />;

    return <BlankPage />;
};
