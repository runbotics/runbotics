import React from 'react';
import type { FC } from 'react';
import { ProcessBuildTab, SidebarProps } from 'src/types/sidebar';
import { SidebarButton, SidebarLabel, SidebarRoot } from './Siderbar.styled';

const sidebarTabs = [
    { value: ProcessBuildTab.RUN_INFO, label: 'Run info' },
];

const Sidebar: FC<SidebarProps> = ({ onTabToggle: onTabChange, selectedTab }) => (
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

export default Sidebar;
