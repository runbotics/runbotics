import { ACTION_GROUP, AllActionIds } from '../../actions';

export interface ActionBlacklist {
    id: string;
    actionGroups: ACTION_GROUP[];
    actionIds: AllActionIds[];
}
