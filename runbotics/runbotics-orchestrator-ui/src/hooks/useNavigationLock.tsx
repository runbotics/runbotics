import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useNavigationLock = (isEnabled = true, warningText: string) => {
    const router = useRouter();

    useEffect(() => {
        const handleWindowClose = (e: BeforeUnloadEvent) => {
            if (!isEnabled) return;
            e.preventDefault();
            return (e.returnValue = warningText);
        };

        const handleBrowseAway = () => {
            if (!isEnabled) return;
            if (window.confirm(warningText)) return;
            router.events.emit('routeChangeError');
            throw 'routeChange aborted.';
        };

        window.addEventListener('beforeunload', handleWindowClose);

        router.events.on('routeChangeStart', handleBrowseAway);

        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
            router.events.off('routeChangeStart', handleBrowseAway);
        };
    }, [isEnabled]);
};

export default useNavigationLock;
