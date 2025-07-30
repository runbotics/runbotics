import { ACTION_GROUP } from '../../actions';

export interface ActionBlacklist {
    id: string;
    actionGroups: ACTION_GROUP[];
}
