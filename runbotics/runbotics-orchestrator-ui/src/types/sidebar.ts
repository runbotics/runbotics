export enum ProcessBuildTab {
    RUN_INFO,
    PROPERTIES,
}

export interface SidebarProps {
    selectedTab: ProcessBuildTab;
    onTabToggle: (tab: ProcessBuildTab) => void;
}

export interface SidebarTab {
    value: ProcessBuildTab;
    label: string;
}
