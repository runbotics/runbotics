import React, { FC, useState } from 'react';
import { IBpmnAction } from 'src/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Actions/types';
import { BPMNElement } from 'src/views/process/ProcessBuildView/Modeler/BPMN';
import BpmnModelerType from 'bpmn-js/lib/Modeler';

export interface BpmnFormContext {
    element?: BPMNElement;
    modeler?: BpmnModelerType;
    action?: IBpmnAction;
    setAction?: (action: IBpmnAction) => void;
}

const BpmnFormContext = React.createContext<BpmnFormContext>(null);
export const useBpmnFormContext = () => {
    const context = React.useContext<BpmnFormContext>(BpmnFormContext);
    return context;
};

type Props = {
    element?: BPMNElement;
    modeler?: BpmnModelerType;
};

const BpmnFormProvider: FC<Props> = ({ modeler, element, children }) => {
    const [action, setAction] = useState<IBpmnAction>(null);

    return (
        <BpmnFormContext.Provider value={{
            modeler, element, action, setAction,
        }}
        >
            {children}
        </BpmnFormContext.Provider>
    );
};

export default BpmnFormProvider;
