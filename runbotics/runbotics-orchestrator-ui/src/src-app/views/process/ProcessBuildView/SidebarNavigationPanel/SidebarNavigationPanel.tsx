import React, { useMemo, FC } from 'react';

import { FeatureKey } from 'runbotics-common';


import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';
import { ProcessBuildTab, SidebarProps } from '#src-app/types/sidebar';

import { SidebarNavigationButton, SidebarNavigationWrapper } from './Siderbar.styled';


interface TabInfo {
    value: ProcessBuildTab;
    label: string;
}

const SidebarNavigationPanel: FC<SidebarProps> = ({ onTabToggle: onTabChange, selectedTab }) => {
    const hasReadProcessInfoAccess = useFeatureKey([FeatureKey.PROCESS_INSTANCE_READ]);
    const { translate } = useTranslations();

    const sidebarTabs = useMemo(() => {
        const tabs: TabInfo[] = [];
        if (hasReadProcessInfoAccess)
        { tabs.push({ value: ProcessBuildTab.RUN_INFO, label: translate('Process.MainView.Sidebar.RunInfo') }, {value: ProcessBuildTab.PROCESS_VARIABLES, label: translate('Process.MainView.Sidebar.ProcessVariables')}); }

        return tabs;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasReadProcessInfoAccess]);

    return (
        <SidebarNavigationWrapper>
            {sidebarTabs.map(({ label, value }) => (
                <SidebarNavigationButton
                    key={value}
                    onClick={() => onTabChange(value)}
                    selected={value === selectedTab}
                >
                    {label}
                </SidebarNavigationButton>
            ))}
        </SidebarNavigationWrapper>
    );
};

export default SidebarNavigationPanel;
