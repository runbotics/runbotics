import { DependencyList, useEffect } from 'react';

const useAsyncEffect = (effect: () => void, deps?: DependencyList) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => effect(), deps);
};

export default useAsyncEffect;
