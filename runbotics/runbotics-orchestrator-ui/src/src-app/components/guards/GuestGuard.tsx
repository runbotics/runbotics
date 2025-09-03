import { FC, VFC, useEffect } from 'react';

import { useRouter } from 'next/router';


import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { authActions } from '#src-app/store/slices/Auth';
import { Language } from '#src-app/translations/translations';
import BlankPage from '#src-app/utils/BlankPage';
import { redirectToWebsiteRoot } from '#src-app/utils/navigation';

import { hasRoles } from '../utils/Secured';

// eslint-disable-next-line react/display-name
export const withGuestGuard = (Component: FC | VFC) => (props: any) => {
    const { isAuthenticated, isInitialized, user } = useAuth();
    const { isAdmin, isGuest, isOnlyRoleUser } = hasRoles(user);
    const router = useRouter();
    const dispatch = useDispatch();
    const isBrowser = typeof window !== 'undefined';
    const { switchLanguage } = useTranslations();

    useEffect(() => {
        switchLanguage(router.locale as Language);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.locale]);

    if (isBrowser && isInitialized && isAuthenticated) {
        if (isAdmin) {
            router.replace('/app/tenants', null, { locale: user.langKey });
        }

        if (isOnlyRoleUser) {
            router.replace('/app/assistant', null, { locale: user.langKey });
        } else if (!isGuest && !isAdmin) {
            router.replace('/app/processes/collections', null, {
                locale: user.langKey,
            });
        }

        if (isGuest && router.query.guest !== 'true') {
            dispatch(authActions.logout()).then(() => {
                redirectToWebsiteRoot(user.langKey);
            });
        }
    }

    if (isBrowser && isInitialized && !isAuthenticated) return <Component {...props} />;

    return <BlankPage />;
};
