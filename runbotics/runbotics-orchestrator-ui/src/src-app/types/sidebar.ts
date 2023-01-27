export enum ProcessBuildTab {
    RUN_INFO,
    CONFIGURE_ACTION,
    PROCESS_VARIABLES
}

export interface SidebarProps {
    selectedTab: ProcessBuildTab;
    onTabToggle: (tab: ProcessBuildTab) => void;
}

export interface SidebarTab {
    value: ProcessBuildTab;
    label: string;
}
