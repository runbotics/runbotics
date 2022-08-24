import React, { FC } from 'react';
import BpmnModelerType from 'bpmn-js/lib/Modeler';

export interface ModelerContext {
    modeler?: BpmnModelerType;
}

const ModelerContext = React.createContext<ModelerContext>(null);
export const useModelerContext = () => {
    const context = React.useContext<ModelerContext>(ModelerContext);
    return context;
};

interface ModelerProviderProps {
    modeler?: BpmnModelerType;
}

const ModelerProvider: FC<ModelerProviderProps> = ({ modeler, children }) => {
    return (
        <ModelerContext.Provider
            value={{
                modeler,
            }}
        >
            {children}
        </ModelerContext.Provider>
    );
};

export default ModelerProvider;
