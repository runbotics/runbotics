import React, { useMemo } from 'react';
import type { FC } from 'react';
import { ProcessBuildTab, SidebarProps } from 'src/types/sidebar';
import useFeatureKey from 'src/hooks/useFeatureKey';
import { FeatureKey } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';
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
        if (hasReadProcessInfoAccess) {
            tabs.push({ value: ProcessBuildTab.RUN_INFO, label: translate('Process.MainView.Sidebar.RunInfo') });
        }
        return tabs;
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
