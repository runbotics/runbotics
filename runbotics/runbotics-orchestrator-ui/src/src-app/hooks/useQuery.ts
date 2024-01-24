import { useRouter } from 'next/router';

const useQuery = () => {
    const { query } = useRouter();

    const firstValueFrom = (param: string) => {
        const queryParamValue = query[param];

        if (Array.isArray(queryParamValue)) {
            return queryParamValue[0];
        }

        if (typeof queryParamValue === 'string') {
            return queryParamValue;
        }

        return queryParamValue;
    };

    const allValuesFrom = (param: string) => {
        const queryParamValue = query[param];

        if (Array.isArray(queryParamValue)) {
            return queryParamValue;
        }

        if (typeof queryParamValue === 'string') {
            return [ queryParamValue ];
        }

        return queryParamValue;
    };

    return {
        query,
        firstValueFrom,
        allValuesFrom,
    };
};

export default useQuery;
