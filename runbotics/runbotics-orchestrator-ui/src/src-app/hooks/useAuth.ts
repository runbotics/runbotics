import { useMemo } from 'react';

import { useSelector } from '../store';

const useAuth = () => {
    const auth = useSelector((state) => state.auth);
    
    return useMemo(() => auth, [auth]);
};

export default useAuth;
