import { useEffect, useState } from 'react';

interface WindowSize {
    width: number;
    height: number;
}

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const changeWindowSize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', changeWindowSize);

        return () => {
            window.removeEventListener('resize', changeWindowSize);
        };
    }, []);

    return windowSize;
};

export default useWindowSize;
