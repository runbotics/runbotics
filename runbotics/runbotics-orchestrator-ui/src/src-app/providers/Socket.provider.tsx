import React, { FC, useEffect, useMemo } from 'react';

import { io, Socket } from 'socket.io-client';

import useAuth from '#src-app/hooks/useAuth';

export const SocketContext = React.createContext<Socket | null>(null);

interface SocketProviderProps {
    uri: string;
    shouldAttach: boolean;
}

const SocketProvider: FC<SocketProviderProps> = ({ children, uri, shouldAttach }) => {
    const { isAuthenticated } = useAuth();
    const deps = [isAuthenticated, uri, shouldAttach];
    
    const socket = useMemo(() => {
        if (!isAuthenticated || !shouldAttach) return null;

        const accessToken = window.localStorage.getItem('access_token');

        return io(uri, {
            reconnection: true,
            reconnectionDelay: 1000,
            auth: {
                token: accessToken,
            },
            path: '/ws-ui/',
        });
    }, deps);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => () => socket?.disconnect(), [isAuthenticated, shouldAttach]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
