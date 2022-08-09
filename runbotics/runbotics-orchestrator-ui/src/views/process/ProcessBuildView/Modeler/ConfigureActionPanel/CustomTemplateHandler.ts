import { TemplatesSchema } from 'src/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Template.types';
import { ActionListPanelProps } from '../ActionListPanel';
import mapSchemaToElements from './MapSchemaToElements';

export default (event: any, props: ActionListPanelProps, schema: TemplatesSchema): void => {
    props.modeler
        .get('create')
        .start(event, mapSchemaToElements(schema, props.modeler));
};
