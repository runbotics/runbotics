import { ProcessStatisticsResult } from '#/types';
import { assignmentLateBase } from '../assets/assignmentLate-icon';
import { assignmentTurnedInBase } from '../assets/assignmentTurnedIn-icon';
import { moreTimeBase } from '../assets/moreTime-icon';
import { scheduleBase } from '../assets/schedule-icon';
import { generateEmailHeader } from './components/email-header.template';
import { processSummaryStyles } from './styles/process-summary-notification-statistics.styles';

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
                                <img src="${assignmentTurnedInBase}" alt="Completed Tasks" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>Wykonane zadania</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.successfulExecutions}</div>
                        </div>
                        </div>
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="${assignmentLateBase}" alt="Failed Tasks" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>Niewykonane zadania</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.failedExecutions}</div>
                        </div>
                        </div>
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="${scheduleBase}" alt="Average Duration" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>Średni czas wykonania</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.averageDuration}s</div>
                        </div>
                        </div>
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="${moreTimeBase}" alt="Total Duration" style="width: 24px; height: 24px;">
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

const assignmentLateBase = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxOCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoCiAgICAgICAgZD0iTTkgMTZDOS4yODMzMyAxNiA5LjUyMDgzIDE1LjkwNDIgOS43MTI1IDE1LjcxMjVDOS45MDQxNyAxNS41MjA4IDEwIDE1LjI4MzMgMTAgMTVDMTAgMTQuNzE2NyA5LjkwNDE3IDE0LjQ3OTIgOS43MTI1IDE0LjI4NzVDOS41MjA4MyAxNC4wOTU4IDkuMjgzMzMgMTQgOSAxNEM4LjcxNjY3IDE0IDguNDc5MTcgMTQuMDk1OCA4LjI4NzUgMTQuMjg3NUM4LjA5NTgzIDE0LjQ3OTIgOCAxNC43MTY3IDggMTVDOCAxNS4yODMzIDguMDk1ODMgMTUuNTIwOCA4LjI4NzUgMTUuNzEyNUM4LjQ3OTE3IDE1LjkwNDIgOC43MTY2NyAxNiA5IDE2Wk04IDEySDEwVjZIOFYxMlpNMiAyMEMxLjQ1IDIwIDAuOTc5MTY3IDE5LjgwNDIgMC41ODc1IDE5LjQxMjVDMC4xOTU4MzMgMTkuMDIwOCAwIDE4LjU1IDAgMThWNEMwIDMuNDUgMC4xOTU4MzMgMi45NzkxNyAwLjU4NzUgMi41ODc1QzAuOTc5MTY3IDIuMTk1ODMgMS40NSAyIDIgMkg2LjJDNi40MTY2NyAxLjQgNi43NzkxNyAwLjkxNjY2NyA3LjI4NzUgMC41NUM3Ljc5NTgzIDAuMTgzMzMzIDguMzY2NjcgMCA5IDBDOS42MzMzMyAwIDEwLjIwNDIgMC4xODMzMzMgMTAuNzEyNSAwLjU1QzExLjIyMDggMC45MTY2NjcgMTEuNTgzMyAxLjQgMTEuOCAySDE2QzE2LjU1IDIgMTcuMDIwOCAyLjE5NTgzIDE3LjQxMjUgMi41ODc1QzE3LjgwNDIgMi45NzkxNyAxOCAzLjQ1IDE4IDRWMThDMTggMTguNTUgMTcuODA0MiAxOS4wMjA4IDE3LjQxMjUgMTkuNDEyNUMxNy4wMjA4IDE5LjgwNDIgMTYuNTUgMjAgMTYgMjBIMlpNMiAxOEgxNlY0SDJWMThaTTkgMy4yNUM5LjIxNjY3IDMuMjUgOS4zOTU4MyAzLjE3OTE3IDkuNTM3NSAzLjAzNzVDOS42NzkxNyAyLjg5NTgzIDkuNzUgMi43MTY2NyA5Ljc1IDIuNUM5Ljc1IDIuMjgzMzMgOS42NzkxNyAyLjEwNDE3IDkuNTM3NSAxLjk2MjVDOS4zOTU4MyAxLjgyMDgzIDkuMjE2NjcgMS43NSA5IDEuNzVDOC43ODMzMyAxLjc1IDguNjA0MTcgMS44MjA4MyA4LjQ2MjUgMS45NjI1QzguMzIwODMgMi4xMDQxNyA4LjI1IDIuMjgzMzMgOC4yNSAyLjVDOC4yNSAyLjcxNjY3IDguMzIwODMgMi44OTU4MyA4LjQ2MjUgMy4wMzc1QzguNjA0MTcgMy4xNzkxNyA4Ljc4MzMzIDMuMjUgOSAzLjI1WiIKICAgICAgICBmaWxsPSIjRkJCMDQwIiAvPgo8L3N2Zz4=';

const assignmentTurnedInBase = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxOCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoCiAgICAgICAgZD0iTTcuNTgwNzUgMTQuNzIzTDE0LjMwMzggOEwxMy4yNSA2Ljk0NjI1TDcuNTgwNzUgMTIuNjE1NUw0LjczMDc1IDkuNzY1NUwzLjY3NyAxMC44MTkzTDcuNTgwNzUgMTQuNzIzWk0yLjMwNzc1IDE5LjVDMS44MDkwOCAxOS41IDEuMzgzMDggMTkuMzIzNCAxLjAyOTc1IDE4Ljk3MDNDMC42NzY1ODMgMTguNjE2OSAwLjUgMTguMTkwOSAwLjUgMTcuNjkyM1Y0LjMwNzc1QzAuNSAzLjgwOTA4IDAuNjc2NTgzIDMuMzgzMDggMS4wMjk3NSAzLjAyOTc1QzEuMzgzMDggMi42NzY1OCAxLjgwOTA4IDIuNSAyLjMwNzc1IDIuNUg2Ljc1Nzc1QzYuODIwNTggMS45NDQ4MyA3LjA2MjkyIDEuNDcyNzUgNy40ODQ3NSAxLjA4Mzc1QzcuOTA2NDIgMC42OTQ1ODMgOC40MTE1IDAuNSA5IDAuNUM5LjU5NDgzIDAuNSAxMC4xMDMyIDAuNjk0NTgzIDEwLjUyNSAxLjA4Mzc1QzEwLjk0NjggMS40NzI3NSAxMS4xODU5IDEuOTQ0ODMgMTEuMjQyMyAyLjVIMTUuNjkyM0MxNi4xOTA5IDIuNSAxNi42MTY5IDIuNjc2NTggMTYuOTcwMyAzLjAyOTc1QzE3LjMyMzQgMy4zODMwOCAxNy41IDMuODA5MDggMTcuNSA0LjMwNzc1VjE3LjY5MjNDMTcuNSAxOC4xOTA5IDE3LjMyMzQgMTguNjE2OSAxNi45NzAzIDE4Ljk3MDNDMTYuNjE2OSAxOS4zMjM0IDE2LjE5MDkgMTkuNSAxNS42OTIzIDE5LjVIMi4zMDc3NVpNMi4zMDc3NSAxOEgxNS42OTIzQzE1Ljc2OTIgMTggMTUuODM5OCAxNy45Njc5IDE1LjkwMzggMTcuOTAzOEMxNS45Njc5IDE3LjgzOTggMTYgMTcuNzY5MyAxNiAxNy42OTIzVjQuMzA3NzVDMTYgNC4yMzA3NSAxNS45Njc5IDQuMTYwMjUgMTUuOTAzOCA0LjA5NjI1QzE1LjgzOTggNC4wMzIwOCAxNS43NjkyIDQgMTUuNjkyMyA0SDIuMzA3NzVDMi4yMzA3NSA0IDIuMTYwMjUgNC4wMzIwOCAyLjA5NjI1IDQuMDk2MjVDMi4wMzIwOCA0LjE2MDI1IDIgNC4yMzA3NSAyIDQuMzA3NzVWMTcuNjkyM0MyIDE3Ljc2OTMgMi4wMzIwOCAxNy44Mzk4IDIuMDk2MjUgMTcuOTAzOEMyLjE2MDI1IDE3Ljk2NzkgMi4yMzA3NSAxOCAyLjMwNzc1IDE4Wk05IDMuMzQ2MjVDOS4yMTY2NyAzLjM0NjI1IDkuMzk1ODMgMy4yNzU0MiA5LjUzNzUgMy4xMzM3NUM5LjY3OTE3IDIuOTkyMDggOS43NSAyLjgxMjkyIDkuNzUgMi41OTYyNUM5Ljc1IDIuMzc5NTggOS42NzkxNyAyLjIwMDQyIDkuNTM3NSAyLjA1ODc1QzkuMzk1ODMgMS45MTcwOCA5LjIxNjY3IDEuODQ2MjUgOSAxLjg0NjI1QzguNzgzMzMgMS44NDYyNSA4LjYwNDE3IDEuOTE3MDggOC40NjI1IDIuMDU4NzVDOC4zMjA4MyAyLjIwMDQyIDguMjUgMi4zNzk1OCA4LjI1IDIuNTk2MjVDOC4yNSAyLjgxMjkyIDguMzIwODMgMi45OTIwOCA4LjQ2MjUgMy4xMzM3NUM4LjYwNDE3IDMuMjc1NDIgOC43ODMzMyAzLjM0NjI1IDkgMy4zNDYyNVoiCiAgICAgICAgZmlsbD0iI0ZCQjA0MCIgLz4KPC9zdmc+';

const moreTimeBase = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoCiAgICAgICAgZD0iTTkuMDAxMjUgMTkuNUM3LjgyMDkyIDE5LjUgNi43MTUxNyAxOS4yNzk3IDUuNjg0IDE4LjgzOUM0LjY1MjY3IDE4LjM5ODMgMy43NTEyNSAxNy43OTI0IDIuOTc5NzUgMTcuMDIxM0MyLjIwODI1IDE2LjI1MDEgMS42MDIwOCAxNS4zNDkxIDEuMTYxMjUgMTQuMzE4M0MwLjcyMDQxNyAxMy4yODc0IDAuNSAxMi4xODE4IDAuNSAxMS4wMDEzQzAuNSA5LjgyMDkzIDAuNzIwNDE3IDguNzE1MTggMS4xNjEyNSA3LjY4NDAxQzEuNjAxOTIgNi42NTI2OCAyLjIwNzkyIDUuNzUxMjYgMi45NzkyNSA0Ljk3OTc2QzMuNzUwNTggNC4yMDgyNiA0LjY1MTc1IDMuNjAyMDkgNS42ODI3NSAzLjE2MTI2QzYuNzEzNzUgMi43MjA0MyA3LjgxOTUgMi41MDAwMSA5IDIuNTAwMDFDOS4zNSAyLjUwMDAxIDkuNjg3NSAyLjUyMDg0IDEwLjAxMjUgMi41NjI1MUMxMC4zMzc1IDIuNjA0MTggMTAuNjY2NyAyLjY2NjY4IDExIDIuNzUwMDFWNC4zMDAwMUMxMC42NjY3IDQuMjAwMDEgMTAuMzM3NSA0LjEyNTAxIDEwLjAxMjUgNC4wNzUwMUM5LjY4NzUgNC4wMjUwMSA5LjM1IDQuMDAwMDEgOSA0LjAwMDAxQzcuMDQ2MTcgNC4wMDAwMSA1LjM5MSA0LjY3ODE4IDQuMDM0NSA2LjAzNDUxQzIuNjc4MTcgNy4zOTEwMSAyIDkuMDQ2MTggMiAxMUMyIDEyLjk1MzggMi42NzgxNyAxNC42MDkgNC4wMzQ1IDE1Ljk2NTVDNS4zOTEgMTcuMzIxOCA3LjA0NjE3IDE4IDkgMThDMTAuOTUzOCAxOCAxMi42MDkgMTcuMzIxOCAxMy45NjU1IDE1Ljk2NTVDMTUuMzIxOCAxNC42MDkgMTYgMTIuOTUzMyAxNiAxMC45OTgzQzE2IDEwLjgxNjEgMTUuOTkxNyAxMC42NDA0IDE1Ljk3NSAxMC40NzEzQzE1Ljk1ODMgMTAuMzAxOSAxNS45MzAyIDEwLjEyNTYgMTUuODkwNSA5Ljk0MjI2SDE3LjQyMUMxNy40NTQzIDEwLjExMjggMTcuNDc1OCAxMC4yODU4IDE3LjQ4NTUgMTAuNDYxNUMxNy40OTUyIDEwLjYzNzIgMTcuNSAxMC44MTY3IDE3LjUgMTFDMTcuNSAxMi4xODA1IDE3LjI3OTcgMTMuMjg2MyAxNi44MzkgMTQuMzE3M0MxNi4zOTgzIDE1LjM0ODMgMTUuNzkyNCAxNi4yNDk0IDE1LjAyMTIgMTcuMDIwOEMxNC4yNTAxIDE3Ljc5MjEgMTMuMzQ5MSAxOC4zOTgxIDEyLjMxODIgMTguODM4OEMxMS4yODc0IDE5LjI3OTYgMTAuMTgxOCAxOS41IDkuMDAxMjUgMTkuNVpNMTEuOTczIDE1LjAyN0w4LjI1IDExLjMwMzhWNi4wMDAwMUg5Ljc1VjEwLjY5NjNMMTMuMDI3IDEzLjk3M0wxMS45NzMgMTUuMDI3Wk0xNiA3Ljk0MjI2VjQuOTQyMjZIMTNWMy40NDIyNkgxNlYwLjQ0MjI2MUgxNy41VjMuNDQyMjZIMjAuNVY0Ljk0MjI2SDE3LjVWNy45NDIyNkgxNloiCiAgICAgICAgZmlsbD0iI0ZCQjA0MCIgLz4KPC9zdmc+';

const scheduleBase = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoCiAgICAgICAgZD0iTTEzLjQ3MyAxNC41MjdMMTQuNTI3IDEzLjQ3M0wxMC43NSA5LjY5NlY1SDkuMjVWMTAuMzAzOEwxMy40NzMgMTQuNTI3Wk0xMC4wMDE3IDE5LjVDOC42ODc3NSAxOS41IDcuNDUyNjcgMTkuMjUwNyA2LjI5NjUgMTguNzUyQzUuMTQwMzMgMTguMjUzMyA0LjEzNDY3IDE3LjU3NjYgMy4yNzk1IDE2LjcyMThDMi40MjQzMyAxNS44NjY5IDEuNzQ3MjUgMTQuODYxNyAxLjI0ODI1IDEzLjcwNkMwLjc0OTQxNyAxMi41NTAzIDAuNSAxMS4zMTU2IDAuNSAxMC4wMDE3QzAuNSA4LjY4Nzc1IDAuNzQ5MzMzIDcuNDUyNjcgMS4yNDggNi4yOTY1QzEuNzQ2NjcgNS4xNDAzMyAyLjQyMzQyIDQuMTM0NjcgMy4yNzgyNSAzLjI3OTVDNC4xMzMwOCAyLjQyNDMzIDUuMTM4MzMgMS43NDcyNSA2LjI5NCAxLjI0ODI1QzcuNDQ5NjcgMC43NDk0MTcgOC42ODQ0MiAwLjUgOS45OTgyNSAwLjVDMTEuMzEyMyAwLjUgMTIuNTQ3MyAwLjc0OTMzMyAxMy43MDM1IDEuMjQ4QzE0Ljg1OTcgMS43NDY2NyAxNS44NjUzIDIuNDIzNDIgMTYuNzIwNSAzLjI3ODI1QzE3LjU3NTcgNC4xMzMwOCAxOC4yNTI4IDUuMTM4MzMgMTguNzUxOCA2LjI5NEMxOS4yNTA2IDcuNDQ5NjcgMTkuNSA4LjY4NDQyIDE5LjUgOS45OTgyNUMxOS41IDExLjMxMjMgMTkuMjUwNyAxMi41NDczIDE4Ljc1MiAxMy43MDM1QzE4LjI1MzMgMTQuODU5NyAxNy41NzY2IDE1Ljg2NTMgMTYuNzIxOCAxNi43MjA1QzE1Ljg2NjkgMTcuNTc1NyAxNC44NjE3IDE4LjI1MjggMTMuNzA2IDE4Ljc1MThDMTIuNTUwMyAxOS4yNTA2IDExLjMxNTYgMTkuNSAxMC4wMDE3IDE5LjVaTTEwIDE4QzEyLjIxNjcgMTggMTQuMTA0MiAxNy4yMjA4IDE1LjY2MjUgMTUuNjYyNUMxNy4yMjA4IDE0LjEwNDIgMTggMTIuMjE2NyAxOCAxMEMxOCA3Ljc4MzMzIDE3LjIyMDggNS44OTU4MyAxNS42NjI1IDQuMzM3NUMxNC4xMDQyIDIuNzc5MTcgMTIuMjE2NyAyIDEwIDJDNy43ODMzMyAyIDUuODk1ODMgMi43NzkxNyA0LjMzNzUgNC4zMzc1QzIuNzc5MTcgNS44OTU4MyAyIDcuNzgzMzMgMiAxMEMyIDEyLjIxNjcgMi43NzkxNyAxNC4xMDQyIDQuMzM3NSAxNS42NjI1QzUuODk1ODMgMTcuMjIwOCA3Ljc4MzMzIDE4IDEwIDE4WiIKICAgICAgICBmaWxsPSIjRkJCMDQwIiAvPgo8L3N2Zz4=';
