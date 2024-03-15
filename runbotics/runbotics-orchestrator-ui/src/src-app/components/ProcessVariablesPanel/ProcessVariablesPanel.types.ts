export enum VariableTag {
    VARIABLE = 'Variable',
    ACTION_OUTPUT = 'ActionOutput',
}

export interface VariablePanelContextMenuState {
    variableName: string;
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

export interface VariableMenuProps {
  anchorElement: HTMLElement,
  handleMenuClose: () => void;
  menuId: string,
  tag: VariableTag
}

export interface VariableCopyProps {
    menuId: string;
    handleMenuClose: () => void;
}
