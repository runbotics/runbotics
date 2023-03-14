export enum VariableTag {
    VARIABLE = 'Variable',
    ACTION_OUTPUT = 'ActionOutput',
}

export interface MenuProps {
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
    menu: MenuProps;
}

export interface VariableCopyMenuProps {
  anchorElement: HTMLElement,
  handleMenuClose: () => void;
  menuId: string,
  tag: VariableTag
}
