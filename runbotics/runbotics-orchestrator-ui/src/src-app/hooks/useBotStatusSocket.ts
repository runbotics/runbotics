import { useContext, useEffect } from 'react';

import { IBot, WsMessage } from 'runbotics-common';

import { SocketContext } from '#src-app/providers/Socket.provider';

import { useDispatch } from '../store';
import { botActions } from '../store/slices/Bot';

export const useBotStatusSocket = () => {
    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on(WsMessage.BOT_STATUS, (bot: IBot) => {
            dispatch(botActions.updateBot(bot));
        });

        socket.on(WsMessage.BOT_DELETE, (id: IBot['id']) => {
            dispatch(botActions.deleteBot(id));
        });

        return () => {
            socket.off(WsMessage.BOT_STATUS);
            socket.off(WsMessage.BOT_DELETE);
        };
    }, [dispatch, socket]);
};

export default useBotStatusSocket;
