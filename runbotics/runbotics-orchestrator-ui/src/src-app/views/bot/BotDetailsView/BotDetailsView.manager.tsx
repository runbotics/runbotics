import React, { VFC } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import If from '#src-app/components/utils/If';
import { BotTab } from '#src-app/utils/bot-tab';

const BotLog = dynamic(() => import('./BotLog'));
const BotConsole = dynamic(() => import('./BotConsole'), { ssr: false });

const BotDetailsViewManager: VFC = () => {
    const router = useRouter();
    const { tab } = router.query;

    return (
        <>
            <If condition={tab === BotTab.LOGS}>
                <BotLog />
            </If>
            <If condition={tab === BotTab.CONSOLE}>
                <BotConsole />
            </If>
        </>
    );
};

export default BotDetailsViewManager;
