import React, { FC, ReactNode, useEffect, useMemo } from 'react';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { io, Socket } from 'socket.io-client';

import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';

export const SocketContext = React.createContext<Socket | null>(null);

interface SocketProviderProps {
    uri: string;
    shouldAttach: boolean;
    children: ReactNode | ReactNode[];
}

const SocketProvider: FC<SocketProviderProps> = ({
    children,
    uri,
    shouldAttach,
}) => {
    const { isAuthenticated } = useAuth();
    const { translate } = useTranslations();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { locale } = useRouter();

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
    }, [isAuthenticated, uri, shouldAttach]);

    useEffect(
        () => () => {
            socket?.disconnect();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isAuthenticated, shouldAttach]
    );

    useEffect(() => {
        closeSnackbar();

        const intervalId = setInterval(() => {
            if (socket === null || !shouldAttach || !socket.disconnected) {
                closeSnackbar('warning');
                return;
            }

            enqueueSnackbar(
                translate('Scheduler.Dialog.NoServerToConnection'),
                {
                    variant: 'warning',
                    key: 'warning',
                    preventDuplicate: true,
                    persist: true,
                    onExited: () => {
                        if(socket.connected){
                            enqueueSnackbar(translate('Scheduler.Dialog.ConnectionRestored'), {
                                variant: 'success',
                                preventDuplicate: true,
                                autoHideDuration: 5000,
                                key: 'restored',
                            });
                        }
                    }
                }
            );

        }, 1500);

        return () => {
            clearInterval(intervalId);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale, socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
