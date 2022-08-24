import React, { useMemo } from 'react';
import type { FC } from 'react';
import { ProcessBuildTab, SidebarProps } from 'src/types/sidebar';
import useFeatureKey from 'src/hooks/useFeatureKey';
import { FeatureKey } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';
import { SidebarButton, SidebarLabel, SidebarRoot } from './Siderbar.styled';

const Sidebar: FC<SidebarProps> = ({ onTabToggle: onTabChange, selectedTab }) => {
    const hasReadProcessInfoAccess = useFeatureKey([FeatureKey.PROCESS_INSTANCE_READ]);
    const { translate } = useTranslations();

    const sidebarTabs = useMemo(() => {
        const tabs = [];
        if (hasReadProcessInfoAccess) {
            tabs.push({ value: ProcessBuildTab.RUN_INFO, label: translate('Process.MainView.Sidebar.RunInfo') });
        }
        return tabs;
    }, [hasReadProcessInfoAccess]);

    return (
        <SidebarRoot>
            {sidebarTabs
                .map((tab) => (
                    <SidebarButton
                        type="button"
                        key={tab.value}
                        onClick={() => onTabChange(tab.value)}
                        selected={tab.value === selectedTab}
                    >
                        <SidebarLabel>{tab.label}</SidebarLabel>
                    </SidebarButton>
                ))}
        </SidebarRoot>
    );
};

export default Sidebar;
