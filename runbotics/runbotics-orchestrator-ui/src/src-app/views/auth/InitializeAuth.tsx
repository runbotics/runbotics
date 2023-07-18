import React, { useEffect } from 'react';

import useAuth from '#src-app/hooks/useAuth';
import { useDispatch } from '#src-app/store';
import { initialize } from '#src-app/store/slices/Auth/Auth.thunks';
import BlankPage from '#src-app/utils/BlankPage';

const InitializeAuth = ({ children }) => {
    const dispatch = useDispatch();
    const { isInitialized } = useAuth();

    useEffect(() => {
        dispatch(initialize());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isInitialized) return <BlankPage />;

    return children;
};

export default InitializeAuth;
