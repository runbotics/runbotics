import BpmnIoModeler from 'bpmn-js/lib/Modeler';

import { TemplatesSchema } from '#src-app/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Template.types';

import mapSchemaToElements from './MapSchemaToElements';

// eslint-disable-next-line import/no-anonymous-default-export
export default (
    event: any,
    modeler: BpmnIoModeler,
    schema: TemplatesSchema
): void => {
    modeler.get('create').start(event, mapSchemaToElements(schema, modeler));
};
