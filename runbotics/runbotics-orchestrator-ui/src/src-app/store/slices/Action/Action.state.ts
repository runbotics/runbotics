import { IBpmnAction } from '#src-app/Actions/types';
import LoadingType from '#src-app/types/loading';
import { IAction } from '#src-app/types/model/action.model';

export interface ActionState {
    draft: {
        action: IAction;
        loading: LoadingType;
        currentRequestId: any;
        error: any;
    };
    bpmnActions: {
        external: string[];
        byId: Record<string, IBpmnAction>;
    };
    showEditModal: boolean;
    actions: {
        loading: boolean;
        byId: Record<string, IAction>;
        allIds: string[];
    };
}
