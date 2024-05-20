export const checkMessageProperty = (value: unknown) =>
    value !== undefined &&
    value !== null &&
    typeof value === 'object' &&
    'message' in value &&
    typeof value.message === 'string' &&
    !!value.message.length &&
    value.message;

export const checkStatusProperty = (value: unknown) =>
    value !== undefined &&
    value !== null &&
    typeof value === 'object' &&
    'status' in value &&
    typeof value.status === 'number' &&
    value.status;
