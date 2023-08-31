export const getHttpStatusKeyword = (httpCode: number): string | number => {
    if (httpCode >= 400 && httpCode < 500) {
        return '4xx';
    } else if (httpCode > 504 && httpCode < 600) {
        return '5xx';
    }
    return httpCode;
};
