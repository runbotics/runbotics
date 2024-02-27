

import {
    TreeItemProps,
} from '@mui/x-tree-view/TreeItem';

import { TootltipIcon as TootltipIconType } from '#src-app/components/TooltipIcon/TooltipIcon.types';

export type StyledTreeItemRootProps = TreeItemProps & {
    $haschildren: boolean;
};

export interface CustomTreeItemProps extends StyledTreeItemRootProps {
    labelIcon: TootltipIconType;
    labelText: string;
};

