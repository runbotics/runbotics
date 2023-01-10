import { useMemo } from 'react';

import { useRouter } from 'next/router';
const useQuery = () => {
    const { query } = useRouter();
    const search = useMemo(() => query.search, [query.search]);

    return useMemo(() => new URLSearchParams(search as string), [search]);
};

export default useQuery;
