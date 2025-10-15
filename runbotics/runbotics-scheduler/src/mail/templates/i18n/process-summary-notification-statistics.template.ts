import { I18nService } from '#/mail/i18n.service';
import { ProcessStatisticsResult } from '#/types';
import environment from '#/utils/environment';
import { DEFAULT_LANGUAGE, Language } from 'runbotics-common';
import { assignmentLateBase } from '../../assets/assignmentLate-icon';
import { assignmentTurnedInBase } from '../../assets/assignmentTurnedIn-icon';
import { moreTimeBase } from '../../assets/moreTime-icon';
import { scheduleBase } from '../../assets/schedule-icon';
import { generateEmailHeader } from '../components/email-header.template';
import { mainStyles } from '../styles/main-template.styles';
import { processSummaryStyles } from '../styles/process-summary-notification-statistics.styles';

export const generateAggregatedEmailContent = (
  summaries: { name: string; stats: ProcessStatisticsResult }[],
  unsubscribeUrl: string,
  i18n: I18nService,
  lang: Language = DEFAULT_LANGUAGE
): string => {
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${i18n.translate('mail.processSummary.subject', lang)}</title>
  <style>
    ${mainStyles}
    ${processSummaryStyles}
  </style>
</head>
<body>
  <table class="container">
    ${generateEmailHeader()}
    <tr>
      <td class="content">
        <h2>${i18n.translate('mail.processSummary.subject', lang)}</h2>
        <p>${i18n.translate('mail.processSummary.greeting', lang)},</p>
        <p>${i18n.translate('mail.processSummary.intro', lang, { fromDate: summaries[0].stats.fromDate, toDate: summaries[0].stats.toDate })}</p>

        ${summaries
          .map(
            ({ name, stats }) => `
            <div class="summary">
                <div class="summary-header">${name}</div>
                    <div class="stats-row" style="display: flex; flex-wrap: wrap; margin-bottom: 10px;">
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="${assignmentTurnedInBase}" alt="Completed Tasks" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>${i18n.translate('mail.processSummary.completedTasks', lang)}</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.successfulExecutions}</div>
                        </div>
                        </div>
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="${assignmentLateBase}" alt="Failed Tasks" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>${i18n.translate('mail.processSummary.failedTasks', lang)}</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.failedExecutions}</div>
                        </div>
                        </div>
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="${scheduleBase}" alt="Average Duration" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>${i18n.translate('mail.processSummary.averageDuration', lang)}</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.averageDuration}s</div>
                        </div>
                        </div>
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="${moreTimeBase}" alt="Total Duration" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>${i18n.translate('mail.processSummary.totalDuration', lang)}</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.totalDuration}s</div>
                        </div>
                    </div>
                </div>
            </div>
          `
          )
          .join('')}
        <p>${i18n.translate('mail.processSummary.moreDetails', lang)} <a href="#" style="color: #fbb040;">${i18n.translate('mail.processSummary.moreDetailsLink', lang)}</a>.</p>
        <p>${i18n.translate('mail.processSummary.thankYou', lang)}</p>
        <p><strong>${i18n.translate('mail.processSummary.signature', lang)}</strong></p>
      </td>
    </tr>
    <tr>
      <td class="footer">
        <p>${i18n.translate('mail.processSummary.unsubscribeMessage', lang)} <a href="${unsubscribeUrl}" style="color: #fbb040;">${i18n.translate('mail.processSummary.unsubscribeLink', lang)}</a>.</p>
        <p>${i18n.translate('mail.processSummary.copyright', lang, { year: '2025', env: environment.runboticsEnv, version: environment.version })}</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
