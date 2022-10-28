import { VFC } from 'react';
import useTranslations from 'src/hooks/useTranslations';

type IActions = {
    [key: string]: { [key: string]: any };
};

const actionsTranslations<VFC> = (): IActions => {
    const { translate } = useTranslations();

    return ({
        api: {
            request: translate('Process.Details.Modeler.Actions.Api.Label'),
        },
        
    });
};

export default actionsTranslations;
