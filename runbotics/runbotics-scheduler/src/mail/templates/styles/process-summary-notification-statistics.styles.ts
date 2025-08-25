export const processSummaryStyles = `
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
    .stats-row {
      flex-direction: column;
    }
    .stat {
      width: 99%;
    }
  }
`;