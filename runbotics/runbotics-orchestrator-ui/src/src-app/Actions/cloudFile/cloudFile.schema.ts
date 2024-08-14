import { UiSchema } from '@rjsf/core';

import { translate } from '#src-app/hooks/useTranslations';

export const siteNameUI: UiSchema = {
    title: translate('Process.Details.Modeler.Actions.Microsoft.SiteName'),
    type: 'string',
    'ui:options': {
        info: translate('Process.Details.Modeler.Actions.Microsoft.SiteName.Info')
    }
};

export const listNameUI: UiSchema = {
    title: translate('Process.Details.Modeler.Actions.Microsoft.ListName'),
    type: 'string',
    'ui:options': {
        info: translate('Process.Details.Modeler.Actions.Microsoft.ListName.Info')
    }
};

export const siteRelativePathUI: UiSchema = {
    title: translate('Process.Details.Modeler.Actions.Microsoft.SiteRelativePath'),
    type: 'string',
    'ui:options': {
        info: translate('Process.Details.Modeler.Actions.Microsoft.SiteRelativePath.Info')
    }
};
