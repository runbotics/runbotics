interface RejectionPayload {
    payload: {
        message: string;
    };
}

export const hasErrorMessage = (value: unknown): value is RejectionPayload =>
    value !== null &&
    value !== undefined &&
    typeof value === 'object' &&
    'payload' in value &&
    typeof value.payload === 'object' &&
    'message' in value.payload &&
    typeof value.payload.message === 'string';
