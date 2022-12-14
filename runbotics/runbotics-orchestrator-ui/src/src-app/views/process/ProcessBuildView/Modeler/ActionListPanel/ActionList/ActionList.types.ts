import { Item } from '../../ListGroup';
import { Filters, GroupProperties } from '../ActionListPanel.types';
import { GroupAction, GroupState } from '../useGroupsReducer';

export interface ActionListProps {
    groups: GroupProperties[];
    openGroupsState: GroupState;
    dispatchGroups: React.Dispatch<GroupAction>;
    handleItemClick: (event: React.MouseEvent<HTMLElement>, item: Item) => void;
    filters: Filters;
}
