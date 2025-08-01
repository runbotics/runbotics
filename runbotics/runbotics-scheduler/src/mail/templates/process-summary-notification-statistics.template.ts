import { ProcessStatisticsResult } from '#/types';
import { generateEmailHeader } from './components/email-header.template';
import { processSummaryStyles } from './styles/process-summary-notification-statistics.styles';

const assetsUrl = `${process.env.RUNBOTICS_ENTRYPOINT_URL}/assets`;
export const generateAggregatedEmailContent = (summaries: { name: string; stats: ProcessStatisticsResult }[]): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Statystyki Procesów</title>
  <style>
    ${processSummaryStyles}
  </style>
</head>
<body>
  <table class="container">
    ${generateEmailHeader()}
    <tr>
      <td class="content">
        <h2>Statystyki procesów</h2>
        <p>Cześć,</p>
        <p>Oto najnowsze statystyki dla śledzonego procesu w okresie: <strong>${summaries[0].stats.fromDate} - ${summaries[0].stats.toDate}</strong>.</p>

        ${summaries
          .map(
            ({ name, stats }) => `
            <div class="summary">
                <div class="summary-header">${name}</div>
                    <div class="stats-row" style="display: flex; flex-wrap: wrap; margin-bottom: 10px;">
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="${assetsUrl}/assignment_turned_in.svg" alt="Completed Tasks" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>Wykonane zadania</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.successfulExecutions}</div>
                        </div>
                        </div>
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="${assetsUrl}/assignment_late.svg" alt="Failed Tasks" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>Niewykonane zadania</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.failedExecutions}</div>
                        </div>
                        </div>
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="${assetsUrl}/schedule.svg" alt="Average Duration" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>Średni czas wykonania</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.averageDuration}s</div>
                        </div>
                        </div>
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="${assetsUrl}/more_time.svg" alt="Total Duration" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>Łączny czas wykonania</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.totalDuration}s</div>
                        </div>
                    </div>
                </div>
            </div>
          `
          )
          .join('')}
        <p>Jeśli chcesz zobaczyć więcej szczegółów, <a href="#" style="color: #fbb040;">zaloguj się do panelu statystyk procesu</a>.</p>
        <p>Dziękujemy za zaufanie!</p>
        <p><strong>Zespół RunBotics</strong></p>
      </td>
    </tr>
    <tr>
      <td class="footer">
        <p>Nie chcesz otrzymywać takich wiadomości? <a href="#" style="color: #fbb040;">Kliknij tutaj</a>.</p>
        <p>2025 &copy; RunBotics</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};