import { I18nService } from '#/mail/i18n.service';
import environment from '#/utils/environment';
import { DEFAULT_LANGUAGE, Language } from 'runbotics-common';
import { generateEmailHeader } from '../components/email-header.template';
import { mainStyles } from '../styles/main-template.styles';
import { subscriptionExpirationNotificationStyles } from '../styles/subscription-expiration-notification.styles';

export const subscriptionExpirationNotificationTemplate = (
  emails: string,
  diffDays: number,
  i18n: I18nService,
  lang: Language = DEFAULT_LANGUAGE
): string => {
  const statusMessage = diffDays <= 0 
    ? i18n.translate('mail.subscriptionExpiration.expired', lang)
    : i18n.translate('mail.subscriptionExpiration.expiring', lang, { days: diffDays.toString() });

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${i18n.translate('mail.subscriptionExpiration.subject', lang)}</title>
    <style>
        ${mainStyles}
        ${subscriptionExpirationNotificationStyles}
    </style>
    </head>
    <body>
    <table class="container">
        ${generateEmailHeader()}
        <tr>
        <td class="content">
            <h2>${i18n.translate('mail.subscriptionExpiration.title', lang, { status: statusMessage })}</h2>
            <p>${i18n.translate('mail.subscriptionExpiration.greeting', lang)},</p>
            <p>${i18n.translate('mail.subscriptionExpiration.expirationInfo', lang)} ${statusMessage}</p>
            <p>${i18n.translate('mail.subscriptionExpiration.renewMessage', lang)}</p>
            <a href="${emails}" alt="${emails}" style="color: #fbb040; text-decoration: none;" class="linkToMail">${i18n.translate('mail.subscriptionExpiration.contactLink', lang)}</a>
            <p>${i18n.translate('mail.subscriptionExpiration.teamMessage', lang)}</p>
            <p>${i18n.translate('mail.subscriptionExpiration.thankYou', lang)}</p>
            <p><strong>${i18n.translate('mail.subscriptionExpiration.signature', lang)}</strong></p>
        </td>
        </tr>
        <tr>
        <td class="footer">
            <p>${i18n.translate('mail.subscriptionExpiration.unsubscribeMessage', lang)} <a href="#" style="color: #fbb040;">${i18n.translate('mail.subscriptionExpiration.unsubscribeLink', lang)}</a>.</p>
            <p>${i18n.translate('mail.subscriptionExpiration.copyright', lang, { year: '2025', env: environment.runboticsEnv, version: environment.version })}</p>
        </td>
        </tr>
    </table>
    </body>
    </html>
  `;
};
