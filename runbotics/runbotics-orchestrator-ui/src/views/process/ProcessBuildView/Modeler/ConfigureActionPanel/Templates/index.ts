import { TemplatesSchema } from 'src/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Template.types';
import { ApiTemplate } from './ApiTemplate';
import { LoginTemplate } from './LoginTemplate';

export const internalTemplates: Readonly<Record<string, TemplatesSchema>> = {
    'browser.login': LoginTemplate,
    'api.test': ApiTemplate,
};

export default internalTemplates;
