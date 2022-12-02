import { NextRouter, useRouter } from 'next/router';

const replaceQueryParams = (queryParams: Record<string, any>, router: NextRouter): void => {
    const filteredQueryParams = Object.keys(queryParams).reduce((acc, key) => {
        if (queryParams[key]) 
        { acc[key] = queryParams[key]; }
        
        return acc;
    }, {} as Record<string, any>);
    router.replace({ pathname: router.pathname, query: filteredQueryParams });
};

export const useReplaceQueryParams = (): ((queryParams: Record<string, any>) => void) => {
    const router = useRouter();
    return (queryParams: Record<string, any>) => replaceQueryParams(queryParams, router);
};
