import config from "../../config/config";
import {AuthResponseError} from "../../types/auth-response-error.type";
import {RefreshResponse} from "../../types/refresh-response.type";
import {LoginResponse} from "../../types/login-response.type";

export class Auth {

    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoKey: string = 'userInfo';

    public static async processUnauthorizedRequest(): Promise<boolean> {
        // Retrieve the refresh token from local storage
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);

        // If the refresh token is not available, remove the tokens and return false
        if (!refreshToken) {
            this.removeTokens();
            return false;
        }

        try {
            // Send a POST request to the server to refresh the token
            const response: Response = await fetch(`${config.api}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            // If the server responds with an unsuccessful status, throw an error
            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            // Parse the response as JSON
            const result: RefreshResponse | AuthResponseError = await response.json();

            // If the response contains an error, throw an error
            if (result && 'error' in result && result.error) {
                throw new Error('Error refreshing token');
            }

            // Set the new tokens
            if (result && 'tokens' in result && result.tokens) {
                this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
            }

            return true;

        } catch (error) {
            // Log the error, remove the tokens, and return false
            console.error(error);
            this.removeTokens();
            return false;
        }
    }

    public static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    public static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    public static setUserInfo(info: string): void {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    static getUserInfo(): string | null {
        const userInfo: string | null = localStorage.getItem(this.userInfoKey)!;
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }
}