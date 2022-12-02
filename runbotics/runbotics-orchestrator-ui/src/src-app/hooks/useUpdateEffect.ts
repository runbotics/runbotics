import { DependencyList, useEffect, useRef } from 'react';

const useUpdateEffect = (effect: () => any, deps?: DependencyList) => {
    const firstRenderRef = useRef(true);

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

export default useUpdateEffect;
