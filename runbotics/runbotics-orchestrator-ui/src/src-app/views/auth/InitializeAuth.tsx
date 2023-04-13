import React, { useEffect } from 'react';

import useAuth from '#src-app/hooks/useAuth';
import { useDispatch } from '#src-app/store';
import { initialize } from '#src-app/store/slices/Auth/Auth.thunks';
import BlankPage from '#src-app/utils/BlankPage';

const isBrowser = typeof window !== 'undefined';

const InitializeAuth = ({ children }) => {
    const dispatch = useDispatch();
    const { isInitialised } = useAuth();

    useEffect(() => {
        dispatch(initialize());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isBrowser && !isInitialised) return <BlankPage />;

    return children;
};

export default InitializeAuth;
