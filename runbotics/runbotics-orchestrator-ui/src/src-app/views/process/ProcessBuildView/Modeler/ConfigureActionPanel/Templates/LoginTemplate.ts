import { translate } from '#src-app/hooks/useTranslations';
import {
    ElementType,
    TemplatesSchema,
} from '#src-app/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Template.types';

export const LoginTemplate: TemplatesSchema = {
    name: translate('Process.Details.Modeler.Templates.Login.Name'),
    id: 'browser.login',
    type: ElementType.SERVICE_TASK,
    bpmnAction: 'browser.launch',
    label: 'launchBrowser',
    input: {
        headless: true,
    },
    right: {
        type: ElementType.SERVICE_TASK,
        bpmnAction: 'browser.selenium.open',
        label: 'openWebsite',
        input: {
            target: 'https://runbotics-prod.clouddc.eu/',
        },
        right: {
            type: ElementType.SERVICE_TASK,
            bpmnAction: 'browser.selenium.type',
            label: 'typeEmail',
            input: {
                target: 'css=input[name=\'email\'][type=\'email\']',
                value: 'user@localhost',
            },
            right: {
                type: ElementType.SERVICE_TASK,
                bpmnAction: 'browser.selenium.type',
                label: 'typePassword',
                input: {
                    target: 'css=input[name=\'password\'][type=\'password\']',
                    value: 'user',
                },
                right: {
                    type: ElementType.SERVICE_TASK,
                    bpmnAction: 'browser.selenium.click',
                    label: 'submit',
                    input: {
                        target: 'css=button[type=\'submit\']',
                    },
                },
            },
        },
    },
};
