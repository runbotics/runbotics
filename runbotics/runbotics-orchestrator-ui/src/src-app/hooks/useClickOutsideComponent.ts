import {useEffect, MutableRefObject} from 'react';

function useClickOutsideComponent(ref: MutableRefObject<any>, handler: Function) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                handler();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);
}

export default useClickOutsideComponent;
