import React, { FC } from 'react';

import BpmnModelerType from 'bpmn-js/lib/Modeler';

export interface ModelerContext {
    modeler: BpmnModelerType;
}

export const ModelerContext = React.createContext<ModelerContext>(null);

interface ModelerProviderProps {
    children: React.ReactNode;
    modeler?: BpmnModelerType;
}

const ModelerProvider: FC<ModelerProviderProps> = ({ modeler, children }) => (
    <ModelerContext.Provider
        value={{
            modeler
        }}>
        {children}
    </ModelerContext.Provider>
);

export default ModelerProvider;
