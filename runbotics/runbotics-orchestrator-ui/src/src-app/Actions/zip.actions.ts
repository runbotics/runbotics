import { ZipAction } from 'runbotics-common';


import { IBpmnAction, Runner } from './types';
import { translate } from '../hooks/useTranslations';



// eslint-disable-next-line max-lines-per-function
const getZipActions: () => Record<string, IBpmnAction> = () => ({
    'zip.unzipFile': {
        id: ZipAction.UNZIP_FILE,
        label: translate('Process.Details.Modeler.Actions.Zip.Unzip.Label'),
        script: ZipAction.UNZIP_FILE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            path: {
                                title: translate('Process.Details.Modeler.Actions.Zip.Unzip.Path'),
                                type: 'string',
                            },
                            fileName: {
                                title: translate('Process.Details.Modeler.Actions.Zip.Unzip.Name'),
                                type: 'string',
                            }
                        },
                        required: ['path', 'fileName']
                    }
                }
            },
            uiSchema: {
                'ui:order': ['input']
            },
            formData: {
                input: {
                    path: undefined
                }
            }
        }
    }
});

export default getZipActions;
