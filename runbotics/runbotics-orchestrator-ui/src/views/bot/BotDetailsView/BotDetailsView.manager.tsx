import dynamic from 'next/dynamic';
import React, { VFC, Suspense } from 'react';
import { useRouter } from 'next/router';
import If from 'src/components/utils/If';
import { BotTab } from 'src/utils/bot-tab';
import { BotParams } from 'src/utils/types/BotParams';

const BotLog = dynamic(() => import('./BotLog'));
const BotConsole = dynamic(() => import('./BotConsole'));
const BotManagement = dynamic(() => import('./BotManagement'));

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
