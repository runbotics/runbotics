import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

const useLastRoute = () => {
    const router = useRouter();
    const [lastRoute, setLastRoute] = useState<string | null>(null);

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            setLastRoute(router.asPath);
        };

        setLastRoute(router.asPath);

        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router]);

    return lastRoute;
};

export default useLastRoute;
