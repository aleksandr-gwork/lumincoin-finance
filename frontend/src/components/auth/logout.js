import config from "../../config/config.js";
import {Auth} from "./auth.js";

export class Logout {
    constructor() {
        this.logout().then();
    }

    async logout() {
        const refreshToken = localStorage.getItem(Auth.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.api + '/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({[Auth.refreshTokenKey]: refreshToken})
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    Auth.removeTokens();
                    localStorage.removeItem(Auth.userInfoKey);
                    window.location.hash = '#/login';
                    return true;
                }
            }
        } else if (!refreshToken && window.location.hash !== '#/login') {
            window.location.hash = '#/login';
            return true;
        }
        return false;
    }
}