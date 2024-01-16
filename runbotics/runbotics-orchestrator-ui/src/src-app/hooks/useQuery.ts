import { useRouter } from 'next/router';

const useQuery = () => {
    const { query } = useRouter();

    const firstValueFrom = (param: string) => {
        const valueOfQueryParam = query[param];

        if (Array.isArray(valueOfQueryParam)) {
            return valueOfQueryParam[0];
        }

        if (typeof valueOfQueryParam === 'string') {
            return valueOfQueryParam;
        }

        return valueOfQueryParam;
    };

    return {
        query,
        firstValueFrom,
    };
};

export default useQuery;
