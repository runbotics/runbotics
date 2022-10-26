import React, { useEffect } from 'react';
import SplashScreen from 'src/components/SplashScreen';
import useAuth from 'src/hooks/useAuth';
import { useDispatch } from 'src/store';
import { initialize } from 'src/store/slices/Auth/Auth.thunks';

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
