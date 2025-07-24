export interface ProcessStatisticsResult {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageDuration: number;
    totalDuration: number;
    fromDate: string;
    toDate: string;
}
