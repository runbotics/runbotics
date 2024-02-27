import { TootltipIcon as TootltipIconType} from '#src-app/components/TooltipIcon/TooltipIcon.types';

export interface TreeStructureProps {
    currentNodeChildren: TreeStructureItem[];
    setSelected: (selected: string[] | string) => void;
    selected: string[];
    defaultIcon?: TootltipIconType;
    defaultSelected?: string[]
    isMultiSelect?: boolean;
}

export interface TreeStructureItem {
    parentId: string;
    id: string;
    name: string;
    icon?: TootltipIconType;
    children?: TreeStructureItem[];
}
