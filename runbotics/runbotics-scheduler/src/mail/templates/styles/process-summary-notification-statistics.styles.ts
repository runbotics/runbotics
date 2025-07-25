export const processSummaryStyles = `
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
`;