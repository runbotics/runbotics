export interface AuthData {
    token: string;
    refreshToken: string;
    expires: number;
}

export interface APIToken {
    access_token: string;
    refresh_token: string;
    expires_on: number;
}
export interface APICell {
    value?: any;
    values: string[][];
}

