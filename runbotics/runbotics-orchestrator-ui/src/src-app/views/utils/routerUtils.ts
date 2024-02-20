import { NextRouter } from 'next/router';

export const replaceQueryParams = (queryParams: Record<string, any>, router: NextRouter): void => {
    const filteredQueryParams = Object.keys(queryParams).reduce((acc, key) => {
        if (queryParams[key]) 
        { acc[key] = queryParams[key]; }
        
        return acc;
    }, {} as Record<string, any>);
    router.replace({ pathname: router.pathname, query: filteredQueryParams });
};

export const getLastParamOfUrl = (router: NextRouter) => router.asPath.split('/').slice(-1)[0].split('?')[0];
