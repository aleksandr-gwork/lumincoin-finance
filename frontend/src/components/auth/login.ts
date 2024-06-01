import config from "../../config/config";
import {Auth} from "./auth";
import {LoginResponse} from "../../types/login-response.type";
import {AuthResponseError} from "../../types/auth-response-error.type";

export class Login {
    readonly emailRegExp: RegExp = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/;
    readonly passRegExp: RegExp = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{7,})\S$/;
    readonly acceptButton: HTMLElement | null;
    readonly emailInputElement: HTMLElement | null;
    readonly passwordInputElement: HTMLElement | null;
    private rememberInputElement: HTMLElement | null;
    private isValid: boolean = true;

    constructor() {
        this.emailInputElement = document.getElementById("email") as HTMLInputElement;
        this.passwordInputElement = document.getElementById("password") as HTMLInputElement;
        this.rememberInputElement = document.getElementById("rememberMe") as HTMLInputElement;
        this.acceptButton = document.getElementById('accept-button');
        if (this.acceptButton) this.acceptButton.addEventListener('click', this.login.bind(this)); // Login Button click
    }

    public validationInputs(): boolean {
        this.isValid = true;

        if (this.emailInputElement) {
            if ((this.emailInputElement as HTMLInputElement).value.match(this.emailRegExp) && (this.emailInputElement as HTMLInputElement).value.length > 0) {
                this.emailInputElement.classList.remove('is-invalid');
            } else {
                this.emailInputElement.classList.add('is-invalid');
                this.isValid = false;
            }
        }

        if (this.passwordInputElement) {
            if ((this.passwordInputElement as HTMLInputElement).value.match(this.passRegExp) && (this.passwordInputElement as HTMLInputElement).value.length > 0) {
                this.passwordInputElement.classList.remove('is-invalid');
            } else {
                this.passwordInputElement.classList.add('is-invalid');
                this.isValid = false;
            }
        }

        return this.isValid;
    };

    private async login(): Promise<void> {

        if (this.validationInputs()) {
            const loginResult: Response = await fetch(config.api + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: (this.emailInputElement as HTMLInputElement).value,
                    password: (this.passwordInputElement as HTMLInputElement).value,
                    rememberMe: (this.rememberInputElement as HTMLInputElement).checked
                })
            })

            if (loginResult && (loginResult.status < 200 || loginResult.status >= 300)) {
                alert('Неправильная почта или пароль');
                (this.passwordInputElement as HTMLInputElement).value = '';
                return;
            }

            if (loginResult && loginResult.status >= 200 && loginResult.status < 300) {
                const result: LoginResponse | AuthResponseError = await loginResult.json();
                if (result && 'tokens' in result && 'user' in result) {
                    const accessToken: string = result.tokens.accessToken;
                    const refreshToken: string = result.tokens.refreshToken;
                    const user: string = JSON.stringify(result.user);

                    Auth.setTokens(accessToken, refreshToken);
                    Auth.setUserInfo(user);
                }

                window.location.href = '#/';
            }
        }
    }
}