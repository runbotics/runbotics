import { IActivity } from '#src-app/types/model/activity.model';

export interface ActivityState {
    loading: boolean;
    byId: Record<string, IActivity>;
    allIds: string[];
}
