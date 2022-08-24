import LoadingType from 'src/types/loading';
import { IAction } from 'src/types/model/action.model';
import { IBpmnAction } from 'src/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Actions/types';

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
