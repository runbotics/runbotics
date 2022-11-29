import React, { useEffect } from 'react';

import SplashScreen from '#src-app/components/SplashScreen';
import useAuth from '#src-app/hooks/useAuth';
import { useDispatch } from '#src-app/store';
import { initialize } from '#src-app/store/slices/Auth/Auth.thunks';

const InitializeAuth = ({ children }) => {
    const dispatch = useDispatch();
    const { isInitialised } = useAuth();

    useEffect(() => {
        dispatch(initialize());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isInitialised) return <SplashScreen />;

    return children;
};

export default InitializeAuth;
