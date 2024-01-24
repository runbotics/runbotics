import { FolderAction } from 'runbotics-common';

import { IBpmnAction, Runner } from './types';

import { translate } from '../hooks/useTranslations';

// eslint-disable-next-line max-lines-per-function
const getFolderActions = (): Record<string, IBpmnAction> => ({
    'folder.delete': {
        id: FolderAction.DELETE,
        label: translate('Process.Details.Modeler.Actions.Folder.Delete.Label'),
        script: FolderAction.DELETE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Folder.Delete.Label'),
                        type: 'object',
                        properties: {
                            name: {
                                title: translate('Process.Details.Modeler.Actions.Folder.Delete.Name'),
                                type: 'string',
                            },
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Folder.Delete.Path'),
                                type: 'string',
                            },
                            recursive: {
                                title: translate('Process.Details.Modeler.Actions.Folder.Delete.Recursive'),
                                type: 'boolean',
                            }
                        },
                        required: ['name']
                    }
                }
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    path: undefined,
                    name: undefined,
                    recursive: false
                },
            }
        }
    }
});

export default getFolderActions;
