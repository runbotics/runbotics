import { ProcessStatisticsResult } from '#/types';

export const generateAggregatedEmailContent = (summaries: { name: string; stats: ProcessStatisticsResult }[]): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Statystyki Procesów</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      line-height: 1.5;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      width: 100%;
    }
    img {
      display: block;
      max-width: 100%;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .header {
      padding: 20px;
      text-align: center;
      border-bottom: 2px solid #ddd;
    }
    .content {
      padding: 20px;
    }
    .footer {
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 2px solid #ddd;
    }
    .summary {
      background-color: #fafafa;
      border-radius: 8px;
      margin-bottom: 20px;
      padding: 15px;
    }
    .summary-header {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      border-bottom: 2px solid #ddd;
    }
    .stats-row {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .stat {
      width: 50%;
      margin: 10px 0;
    }

    @media only screen and (max-width: 600px) {
      .container {
        width: 100%;
      }
      .stats-row {
        flex-direction: column;
      }
      .stat {
        width: 99%;
      }
    }
  </style>
</head>
<body>
  <table class="container">
    <tr>
      <td class="header">
        <img src="cid:logo" alt="RunBotics Logo" style="max-width: 150px;" />
      </td>
    </tr>
    <tr>
      <td class="content">
        <h2>Statystyki procesów</h2>
        <p>Cześć,</p>
        <p>Oto najnowsze statystyki dla śledzonego procesu w okresie: <strong>01.06.2025 - 05.06.2025</strong>.</p>

        ${summaries
          .map(
            ({ name, stats }) => `
            <div class="summary">
                <div class="summary-header">${name}</div>
                    <div class="stats-row" style="display: flex; flex-wrap: wrap; margin-bottom: 10px;">
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="cid:assignment_turned_in" alt="Completed Tasks" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>Wykonane zadania</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.successfulExecutions}</div>
                        </div>
                        </div>
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="cid:assignment_late" alt="Failed Tasks" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>Niewykonane zadania</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.failedExecutions}</div>
                        </div>
                        </div>
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="cid:schedule" alt="Average Duration" style="width: 24px; height: 24px;">
                            </div>
                        <div>
                            <div>Średni czas wykonania</div>
                            <div style="font-size: 16px; font-weight: bold;">${stats.averageDuration}s</div>
                        </div>
                        </div>
                        <div class="stat" style="display: flex; align-items: center; margin: 10px 0;">
                            <div style="background-color: #fff; border-radius:50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <img src="cid:more_time" alt="Total Duration" style="width: 24px; height: 24px;">
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