import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { VFC, Suspense, useEffect } from 'react';
import If from 'src/components/utils/If';
import { useDispatch } from 'src/store';
import { processActions } from 'src/store/slices/Process';
import { ProcessTab } from 'src/utils/process-tab';
import ProcessConfigureView from '../ProcessConfigureView';

const ProcessBuildView = dynamic(() => import('../ProcessBuildView'), { ssr: false });
const ProcessRunView = dynamic(() => import('../ProcessRunView'));

const ProcessMainViewManager: VFC = () => {
    const dispatch = useDispatch();
    const Router = useRouter();
    const { tab, id } = Router.query;
    console.log(Router.query);
    const processId = Number(id);

    useEffect(() => {
        if (Number.isNaN(processId)) return;

        dispatch(processActions.fetchProcessById(processId));
    }, [processId]);

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
