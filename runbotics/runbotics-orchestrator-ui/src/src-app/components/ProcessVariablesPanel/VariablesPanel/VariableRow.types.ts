export enum VariableTag {
    VARIABLE = 'Variable',
    ACTION_OUTPUT = 'ActionOutput',
}

export interface VariablePanelContextMenuState {
    menuId: string;
    anchorElement?: HTMLElement;
}

export interface VariableRowProps {
    name: string;
    tag: VariableTag;
    getTagBgColor: (tag: VariableTag) => string;
    handleMenuClick: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        name: string
    ) => void;
    handleMenuClose: () => void;
    menu: VariablePanelContextMenuState;
}

export interface VariableCopyMenuProps {
  anchorElement: HTMLElement,
  handleMenuClose: () => void;
  menuId: string,
  tag: VariableTag
}
