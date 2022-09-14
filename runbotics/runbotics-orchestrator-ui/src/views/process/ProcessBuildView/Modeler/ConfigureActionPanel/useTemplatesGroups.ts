import useTranslate from 'src/hooks/useTranslations';
import { internalTemplates } from './Templates';

export const useTemplatesGroups = () => {
    const { translate } = useTranslate();

    return ({
        Login: {
            label: translate('Process.Details.Modeler.ActionPanel.TemplatesGroup.Login'),
            items: [internalTemplates['browser.login']],
        },
        Api: {
            label: translate('Process.Details.Modeler.ActionPanel.TemplatesGroup.API'),
            items: [internalTemplates['api.test']],
        },
    })
}
