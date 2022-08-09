import { DependencyList, useEffect } from 'react';

const useAsyncEffect = (effect: () => void, deps?: DependencyList) => {
    useEffect(() => effect(), deps);
};

export default useAsyncEffect;
