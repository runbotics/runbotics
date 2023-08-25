export const hasErrorMessage = (response: unknown): response is { errorMessage: any } =>
    response &&
    typeof response === 'object' &&
    'errorMessage' in response;
