export const hasErrorMessage = (response: unknown): response is { errorMessage: string } =>
    response &&
    typeof response === 'object' &&
    'errorMessage' in response &&
    typeof response.errorMessage === 'string';
