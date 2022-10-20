import React, { FC, useEffect, useState } from 'react';
import { Console } from 'console-feed';
import { BotParams } from 'src/utils/types/BotParams';
import { useDispatch } from 'src/store';
import { botActions } from 'src/store/slices/Bot';
import { unwrapResult } from '@reduxjs/toolkit';
import { Message } from 'console-feed/lib/definitions/Component';
import { Methods } from 'console-feed/lib/definitions/Console';
import methods from 'console-feed/lib/definitions/Methods';
import useTranslations from 'src/hooks/useTranslations';
import { useRouter } from 'next/router';

const BotConsole: FC = () => {
    const router = useRouter();
    const { id, search } = router.query;
    const dispatch = useDispatch();
    const [logs, setLogs] = useState<Message[]>([]);
    const { translate } = useTranslations();

    useEffect(() => {
        const params = new URLSearchParams(search as string);
        const lines = Number(params.get('lines')) || 100;
        dispatch(botActions.getLogs({ id: Number(id), lines }))
            .then(unwrapResult)
            .then((botLogs) => {
                const logObjs = botLogs.reduce<Message[]>((acc, log, index) => {
                    const splittedLog = log.split(/: \[Nest\] \d+ {3}- /);
                    if (!methods.includes(splittedLog[0])) return acc;
                    return [
                        {
                            id: index.toString(),
                            method: splittedLog[0] as Methods,
                            data: [splittedLog[1]],
                        },
                        ...acc,
                    ];
                }, []);
                setLogs(logObjs);
            })
            .catch(() => {
                setLogs([
                    {
                        id: '0',
                        method: 'error',
                        data: [translate('Bot.Console.ErrorMessage')],
                    },
                ]);
            });
    }, [id, search]);

    return <div style={{ backgroundColor: '#242424' }}>{/* <Console logs={logs} variant="dark" /> */}</div>;
};

export default BotConsole;
