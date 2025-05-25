import React, { VFC, useEffect } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { FeatureKey } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useProcessInstanceSocket from '#src-app/hooks/useProcessInstanceSocket';
import { useProcessQueueSocket } from '#src-app/hooks/useProcessQueueSocket';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions, processSelector } from '#src-app/store/slices/Process';
import { processInstanceSelector } from '#src-app/store/slices/ProcessInstance';
import { ProcessTab } from '#src-app/utils/process-tab';

import { isKnownHttpStatus } from '../../utils/httpStatus';

import ProcessConfigureView from '../ProcessConfigureView';


const ProcessBuildView = dynamic(() => import('../ProcessBuildView'), {
    ssr: false,
});
const ProcessRunView = dynamic(() => import('../ProcessRunView'));

const processViews = {
    [ProcessTab.BUILD]: FeatureKey.PROCESS_BUILD_VIEW,
    [ProcessTab.RUN]: FeatureKey.PROCESS_RUN_VIEW,
    [ProcessTab.CONFIGURE]: FeatureKey.PROCESS_CONFIGURE_VIEW,
} as const;

const isString = (param: unknown): param is string => typeof param === 'string';

const ProcessMainViewManager: VFC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { draft } = useSelector(processSelector);
    const { tab, id } = router.query;
    const processId = Number(id);
    const hasViewAccess = useFeatureKey(isString(tab) ? [processViews[tab]] : []);

    const processInstance = useSelector(processInstanceSelector);
    const { orchestratorProcessInstanceId } = processInstance.active;
    useProcessInstanceSocket({ orchestratorProcessInstanceId });
    useProcessQueueSocket();

    useEffect(() => {
        if (!hasViewAccess || Number.isNaN(processId)) {
            router.replace('/404');
        }

        if (draft.process?.id !== processId) {
            dispatch(processActions.fetchProcessById(processId))
                .then(unwrapResult)
                .catch((err: AxiosError & { statusCode?: number }) => {
                    const status = err.statusCode;
                    if (isKnownHttpStatus(status)) {
                        router.replace(`/${status}`);
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processId, tab, hasViewAccess]);

    return (
        <>
            <If condition={tab === ProcessTab.BUILD}>
                <ProcessBuildView />
            </If>
            <If condition={tab === ProcessTab.RUN}>
                <ProcessRunView />
            </If>
            <If condition={tab === ProcessTab.CONFIGURE}>
                <ProcessConfigureView />
            </If>
        </>
    );
};

export default ProcessMainViewManager;
