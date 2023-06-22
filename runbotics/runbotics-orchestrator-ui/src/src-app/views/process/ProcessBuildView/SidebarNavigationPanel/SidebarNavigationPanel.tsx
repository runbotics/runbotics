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
    const hasVariablesPanelAccess = useFeatureKey([FeatureKey.PROCESS_READ]);
    const hasRunPanelAccess = useFeatureKey([FeatureKey.PROCESS_START]);
    const { translate, currentLanguage } = useTranslations();

    const sidebarTabs = useMemo(() => {
        const tabs: TabInfo[] = [];
        if (hasRunPanelAccess) {
            tabs.push({
                value: ProcessBuildTab.RUN_INFO,
                label: translate('Process.MainView.Sidebar.RunInfo'),
            });
        }
        
        if (hasVariablesPanelAccess) {
            tabs.push({
                value: ProcessBuildTab.PROCESS_VARIABLES,
                label: translate('Process.MainView.Sidebar.ProcessVariables'),
            });
        }

        return tabs;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasRunPanelAccess, hasVariablesPanelAccess, currentLanguage]);

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
