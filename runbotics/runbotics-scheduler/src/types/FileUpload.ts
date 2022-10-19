export interface AuthData {
    token?: string;
    refreshToken?: string;
    expires?: number;
}

export interface APIToken {
    access_token: string;
    refresh_token: string;
    expires_on: number;
}
export interface APICell {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any;
    values: string[][];
}

