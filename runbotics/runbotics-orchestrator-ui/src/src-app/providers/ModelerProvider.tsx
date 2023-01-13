import React, { FC, MutableRefObject } from 'react';

import BpmnModelerType from 'bpmn-js/lib/Modeler';

export interface ModelerContext {
    modelerRef?: MutableRefObject<BpmnModelerType>;
}

const ModelerContext = React.createContext<ModelerContext>(null);
export const useModelerContext = () => {
    const context = React.useContext<ModelerContext>(ModelerContext);
    return context;
};

interface ModelerProviderProps {
    modelerRef?: MutableRefObject<BpmnModelerType>;
}

const ModelerProvider: FC<ModelerProviderProps> = ({
    modelerRef,
    children,
}) => {
    return (
        <ModelerContext.Provider
            value={{
                modelerRef,
            }}
        >
            {children}
        </ModelerContext.Provider>
    );
};

export default ModelerProvider;
