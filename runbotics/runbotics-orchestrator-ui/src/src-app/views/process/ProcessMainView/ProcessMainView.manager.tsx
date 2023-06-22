import React, { VFC, useEffect } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { FeatureKey } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { processInstanceActions } from '#src-app/store/slices/ProcessInstance';
import { ProcessTab } from '#src-app/utils/process-tab';

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
    const { tab, id } = router.query;
    const processId = Number(id);
    const hasViewAccess = useFeatureKey(isString(tab) ? [processViews[tab]] : []);

    useEffect(() => {
        if (!hasViewAccess) {
            router.replace('/404');
        }

        if (Number.isNaN(processId)) return undefined;

        dispatch(processActions.fetchProcessById(processId))
            .then(unwrapResult)
            .catch((response: AxiosResponse) => {
                if (response.status === 403) {
                    router.replace('/404');
                }
            });

        return () => {
            dispatch(processInstanceActions.resetActive());
        };
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
