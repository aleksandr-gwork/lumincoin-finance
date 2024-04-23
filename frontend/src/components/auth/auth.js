import config from "../../config/config.js";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static async processUnauthorizedRequest() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (!refreshToken) {
            this.removeTokens();
            window.location.hash = '#/';
            return false;
        }

        const response = await fetch(config.host + '/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({refreshToken: refreshToken})
        });

        if (response.ok) {
            const result = await response.json();
            if (result && !result.error) {
                this.setTokens(result.accessToken, result.refreshToken);
                return true;
            }
        }

        this.removeTokens();
        window.location.hash = '#/';
        return false;
    }



    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey)
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }
}