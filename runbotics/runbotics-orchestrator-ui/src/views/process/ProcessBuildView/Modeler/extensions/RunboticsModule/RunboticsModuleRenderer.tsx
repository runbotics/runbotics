import React, { FC } from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import SeleniumImporterButton from './SeleniumImporter/SeleniumImporterButton';

const ModelerContext = React.createContext(null);
export const useModeler = () => React.useContext(ModelerContext);
export type RunboticsModuleRendererProps = {
    modeler: BpmnModeler;
};
const RunboticsModuleRenderer: FC<RunboticsModuleRendererProps> = ({ modeler }) => (
    <>
        <ModelerContext.Provider value={modeler}>
            <SeleniumImporterButton />
        </ModelerContext.Provider>
    </>
);

export default RunboticsModuleRenderer;
