export const SECOND = 1000;

export const MINUTE = 60 * SECOND;

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
