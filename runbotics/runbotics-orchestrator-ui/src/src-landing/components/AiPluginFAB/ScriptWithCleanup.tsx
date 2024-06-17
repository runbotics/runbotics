import React, { useEffect } from 'react';

import { useRouter } from 'next/router';
import Script, { ScriptProps } from 'next/script';

export const ScriptWithCleanup = (props: ScriptProps) => {
    const router = useRouter();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'ai-plugin/ai-plugin.js';
        script.async = false;
        document.body.appendChild(script);

        const onRouterChange = (newPath: string) => {
            window.location.href = router.basePath + newPath;
        };
        router.events.on('routeChangeStart', onRouterChange);

        return () => {
            router.events.off('routeChangeStart', onRouterChange);

            document.body.removeChild(script);
        };
    }, [router]);

    return <Script {...props} />;
};
