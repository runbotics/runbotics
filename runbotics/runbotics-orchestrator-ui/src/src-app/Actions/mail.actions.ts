import { MailAction, ActionCredentialType } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';


const getMailActions: () => Record<string, IBpmnAction> = () => ({
    'mail.send': {
        id: MailAction.SEND,
        credentialType: ActionCredentialType.EMAIL,
        label: translate('Process.Details.Modeler.Actions.Mail.Send.Label'),
        script: MailAction.SEND,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            to: {
                                type: 'string',
                                title: translate('Process.Details.Modeler.Actions.Mail.Send.To'),
                            },
                            cc: {
                                title: translate('Process.Details.Modeler.Actions.Mail.Send.CC'),
                                type: 'string',
                            },
                            subject: {
                                title: translate('Process.Details.Modeler.Actions.Mail.Send.Subject'),
                                type: 'string',
                            },
                            attachment: {
                                title: translate('Process.Details.Modeler.Actions.Mail.Send.Attachment'),
                                type: 'string',
                            },
                            content: {
                                title: translate('Process.Details.Modeler.Actions.Mail.Send.Content'),
                                type: 'string',
                            },
                        },
                        required: ['to', 'subject', 'content'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    content: {
                        'ui:widget': 'DraftJSEditor',
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Mail.Send.Content.Info'),
                        },
                    },
                    attachment: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Mail.Send.Attachment.Info'),
                        }
                    },
                },
            },
            formData: {
                input: {
                    to: undefined,
                    cc: '',
                    subject: undefined,
                    attachment: '',
                    content: undefined,
                },
            },
        },
    },
});

export default getMailActions;
