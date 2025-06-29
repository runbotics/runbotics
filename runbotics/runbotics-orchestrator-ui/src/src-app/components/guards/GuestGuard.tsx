import { FC, VFC, useEffect } from 'react';

import { useRouter } from 'next/router';

import { Role } from 'runbotics-common';

import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { authActions } from '#src-app/store/slices/Auth';
import { Language } from '#src-app/translations/translations';
import BlankPage from '#src-app/utils/BlankPage';


// eslint-disable-next-line react/display-name
export const withGuestGuard = (Component: FC | VFC) => (props: any) => {
    const { isAuthenticated, isInitialized, user } = useAuth();
    const router = useRouter();
    const dispatch = useDispatch();
    const isBrowser = typeof window !== 'undefined';
    const { switchLanguage } = useTranslations();

    useEffect(() => {
        switchLanguage(router.locale as Language);
    }, [router.locale]);

    if (isBrowser && isInitialized && isAuthenticated) {
        if (user.roles.includes(Role.ROLE_ADMIN)) {
            router.replace('/app/tenants', null, { locale: user.langKey });
        }

        if (![Role.ROLE_GUEST, Role.ROLE_ADMIN].some(role => user.roles.includes(role))) {
            router.replace('/app/processes/collections', null, { locale: user.langKey });
        }

        if (user.roles.includes(Role.ROLE_GUEST) && router.query.guest !== 'true') {
            dispatch(authActions.logout())
                .then(() => {
                    router.replace('/', null, { locale: user.langKey });
                });
        }
    }

    if (isBrowser && isInitialized && !isAuthenticated) return <Component {...props} />;

    return <BlankPage />;
};
