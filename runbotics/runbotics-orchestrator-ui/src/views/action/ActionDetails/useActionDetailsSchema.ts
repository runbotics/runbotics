import { JSONSchema7 } from 'json-schema';

import useTranslations from 'src/hooks/useTranslations';

const useSchema = (): JSONSchema7 => {
    const { translate } = useTranslations();

    return {
        type: 'object',
        properties: {
            script: {
                type: 'string',
                title: translate('Action.Details.Script'),
            },
            label: {
                type: 'string',
                title: translate('Action.Details.Label'),
            },
            form: {
                type: 'string',
                title: translate('Action.Details.Form'),
            },
        },
        required: ['script', 'label', 'form'],
    };
};

export default useSchema;
