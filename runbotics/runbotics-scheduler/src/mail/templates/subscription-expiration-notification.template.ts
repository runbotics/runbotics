import environment from '#/utils/environment';
import { generateEmailHeader } from './components/email-header.template';
import { mainStyles } from './styles/main-template.styles';
import { subscriptionExpirationNotificationStyles } from './styles/subscription-expiration-notification.styles';


export const subscriptionExpirationNotificationTemplate = (emails: string, diffDays: number) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Twoja subskrypcja dobiega końca</title>
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
            <h2>Twoja subskrypcja ${ diffDays <= 0 ? 'wygasła' : 'dobiega końca' }</h2>
            <p>Cześć,</p>
            <p>Pragniemy poinformować, że Twoja subskrypcja <strong>RunBotics</strong>
                ${
                    diffDays <= 0
                        ? 'wygasła'
                        : `wygaśnie za <p class="expDate">${diffDays} dni</p>`
                }
            <p>Aby ją przedłużyć, skontaktuj się z Nami:</p>
            <a href="${emails}" alt="${emails}" style="color: #fbb040; text-decoration: none;" class="linkToMail">Skontaktuj się</a>
            <p>Nasz zespół z przyjemnością pomoże w odnowieniu subskrypcji oraz odpowie na wszelkie pytania.</p>
            <p>Dziękujemy za zaufanie!</p>
            <p><strong>Zespół RunBotics</strong></p>
        </td>
        </tr>
        <tr>
        <td class="footer">
            <p>Nie chcesz otrzymywać takich wiadomości? <a href="#" style="color: #fbb040;">Kliknij tutaj</a>.</p>
            <p>2025 &copy; ${environment.runboticsEnv} v${environment.version}</p>
        </td>
        </tr>
    </table>
    </body>
    </html>
  `;
};