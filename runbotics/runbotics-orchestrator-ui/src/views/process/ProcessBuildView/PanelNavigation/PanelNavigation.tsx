import React, { useMemo } from 'react';
import type { FC } from 'react';
import { ProcessBuildTab, SidebarProps } from 'src/types/sidebar';
import useFeatureKey from 'src/hooks/useFeatureKey';
import { FeatureKey } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';
import { Button, Root } from './Siderbar.styled';

const PanelNavigation: FC<SidebarProps> = ({ onTabToggle: onTabChange, selectedTab }) => {
    const hasReadProcessInfoAccess = useFeatureKey([FeatureKey.PROCESS_INSTANCE_READ]);
    const { translate } = useTranslations();

    const sidebarTabs = useMemo(() => {
        const tabs: { value: ProcessBuildTab; label: string }[] = [];
        if (hasReadProcessInfoAccess) {
            tabs.push({ value: ProcessBuildTab.RUN_INFO, label: translate('Process.MainView.Sidebar.RunInfo') });
        }
        return tabs;
    }, [hasReadProcessInfoAccess]);

    return (
        <Root>
            {sidebarTabs.map(({ label, value }) => (
                <Button
                    type="button"
                    key={value}
                    onClick={() => onTabChange(value)}
                    selected={value === selectedTab}
                >
                    {label}
                </Button>
            ))}
        </Root>
    );
};

export default PanelNavigation;
