import React, { FC, MutableRefObject } from 'react';

import BpmnModelerType from 'bpmn-js/lib/Modeler';

export interface ModelerContext {
    modelerRef?: MutableRefObject<BpmnModelerType>;
}

export const ModelerContext = React.createContext<ModelerContext>(null);

interface ModelerProviderProps {
    modelerRef?: MutableRefObject<BpmnModelerType>;
}

const ModelerProvider: FC<ModelerProviderProps> = ({
    modelerRef,
    children
}) => (
    <ModelerContext.Provider
        value={{
            modelerRef
        }}>
        {children}
    </ModelerContext.Provider>
);

export default ModelerProvider;
