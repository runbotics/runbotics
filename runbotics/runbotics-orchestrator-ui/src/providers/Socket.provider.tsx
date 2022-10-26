import React, { FC, useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import useAuth from 'src/hooks/useAuth';

const uri = process.env.NEXT_PUBLIC_RUNBOTICS_ENTRYPOINT_URL;
export const SocketContext = React.createContext<Socket | null>(null);

const SocketProvider: FC = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const socket = useMemo(() => {
        if (!isAuthenticated) return null;

        const accessToken = window.localStorage.getItem('access_token');

        return io(uri, {
            reconnection: true,
            reconnectionDelay: 1000,
            auth: {
                token: accessToken,
            },
            path: '/ws-ui/',
        });
    }, [isAuthenticated]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => () => socket?.disconnect(), [isAuthenticated]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
