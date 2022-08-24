import { useRef, useEffect } from 'react';
import type { MutableRefObject } from 'react';

const useIsMountedRef = (): MutableRefObject<boolean> => {
    const isMounted = useRef(true);

    useEffect(
        () => () => {
            isMounted.current = false;
        },
        [],
    );

    return isMounted;
};

export default useIsMountedRef;
