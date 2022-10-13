import React, { FC, useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import useAuth from 'src/hooks/useAuth';

// const uri = process.env.NODE_ENV === 'production'
//     ? `${window.location.origin}`
//     : 'http://localhost:4000';

export const SocketContext = React.createContext<Socket | null>(null);

const SocketProvider: FC = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const socket = useMemo(() => {
        if (!isAuthenticated) {
            return null;
        }
        const accessToken = window.localStorage.getItem('access_token');

        return io('http://localhost:4000', {
            reconnection: true,
            reconnectionDelay: 1000,
            auth: {
                token: accessToken,
            },
            path: '/ws-ui/',
        });
    }, [isAuthenticated]);
    useEffect(() => () => socket?.disconnect(), [isAuthenticated]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
