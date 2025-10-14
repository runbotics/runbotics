import { MsalLoginError } from 'runbotics-common';

export class MsalAuthError extends Error {
    public readonly msalErrorType: MsalLoginError;

    constructor(message: string, msalErrorType: MsalLoginError) {
        super(message);
        this.name = 'MsalAuthError';
        this.msalErrorType = msalErrorType;
    }
}
