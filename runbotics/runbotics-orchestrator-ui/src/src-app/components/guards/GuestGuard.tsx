import { FC, VFC, useEffect } from 'react';

import { useRouter } from 'next/router';

import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';
import StorageManagerService from '#src-app/store/StorageManager.service';
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
    }, [router.locale] );

    if (isBrowser && isInitialised && isAuthenticated) {
        const destinationPage = StorageManagerService.readDestinationPage();
        if (destinationPage) router.replace(destinationPage);
        StorageManagerService.removeDestinationPage();
    }

    if (isBrowser && isInitialised && !isAuthenticated) return <Component {...props} />;

    return <BlankPage />;
};
