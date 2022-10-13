import dynamic from 'next/dynamic';
import React, { VFC, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import If from 'src/components/utils/If';
import { BotTab } from 'src/utils/bot-tab';
import { BotParams } from 'src/utils/types/BotParams';

const BotLog = dynamic(() => import('./BotLog'));
const BotConsole = dynamic(() => import('./BotConsole'));
const BotManagement = dynamic(() => import('./BotManagement'));

const BotDetailsViewManager: VFC = () => {
    const { tab } = useParams<BotParams>();

    return (
        <>
            <If condition={tab === BotTab.LOGS}>
                <BotLog />
            </If>
            <If condition={tab === BotTab.CONSOLE}>
                <BotConsole />
            </If>
            <If condition={tab === BotTab.MANAGEMENT}>
                <BotManagement />
            </If>
        </>
    );
};

export default BotDetailsViewManager;
