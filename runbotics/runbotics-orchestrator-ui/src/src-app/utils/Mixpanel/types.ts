interface TrackBase {
    identifyBy: string;
    trackLabel: TrackLabel;
}

interface SignInUpBase extends TrackBase {
    page: Page;
    userType: UserType;
}

export interface RecordSuccessfulLogin extends SignInUpBase {
    email: string;
    userName: string;
}

export interface RecordFailedLogin extends Omit<SignInUpBase, 'userType'> {
    reason: string;
    userType?: UserType;
}

export interface RecordSuccessfulRegistration extends SignInUpBase {
    email: string;
}

export interface RecordFailedRegistration extends SignInUpBase {
    reason: string;
}

export enum UserType {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest',
    EXTERNAL_USER = 'external_user',
    UNKNOWN = 'unknown',
}

export enum Page {
    LOGIN = 'login',
    REGISTER = 'register'
}

export enum TrackLabel {
    SUCCESSFUL_LOGIN = 'Successful login',
    SUCCESSFUL_REGISTRATION = 'Successful registration',
    UNSUCCESSFUL_LOGIN = 'Unsuccessful login',
    UNSUCCESSFUL_REGISTRATION = 'Unsuccessful registration',
}
