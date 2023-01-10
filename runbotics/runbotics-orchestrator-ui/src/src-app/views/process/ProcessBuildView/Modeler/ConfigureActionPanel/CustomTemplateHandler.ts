
import { TemplatesSchema } from '#src-app/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Template.types';

import { ActionListPanelProps } from '../ActionListPanel';
import mapSchemaToElements from './MapSchemaToElements';


// eslint-disable-next-line import/no-anonymous-default-export
export default (event: any, props: ActionListPanelProps, schema: TemplatesSchema): void => {
    props.modeler
        .get('create')
        .start(event, mapSchemaToElements(schema, props.modeler));
};
