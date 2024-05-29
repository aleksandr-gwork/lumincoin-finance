export interface LoginResponse {
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    user: string;
}