import config from "../../config/config.js";
import {Auth} from "./auth.js";

export class Login {
    constructor() {
        this.findElements();

        this.acceptButton.addEventListener('click', this.login.bind(this)); // Login Button click
    }

    findElements() {
        this.emailInputElement = document.getElementById("email");
        this.passwordInputElement = document.getElementById("password");
        this.rememberInputElement = document.getElementById("rememberMe");
        this.acceptButton = document.getElementById('accept-button');
    }

    validationInputs() {
        let isValid = true;

        this.emailRegExp = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/;
        this.passRegExp = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{8,})\S$/;

        this.form = document.querySelector('form');
        this.formInputs = this.form.querySelectorAll('input');

        if (this.emailInputElement.value.match(this.emailRegExp) && this.emailInputElement.value.length > 0) {
            this.emailInputElement.classList.remove('is-invalid');
        } else {
            this.emailInputElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordInputElement.value.match(this.passRegExp) && this.passwordInputElement.value.length > 0) {
            this.passwordInputElement.classList.remove('is-invalid');
        } else {
            this.passwordInputElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    };

    async login() {

        if (this.validationInputs()) {
            const loginResult = await fetch(config.api + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: this.emailInputElement.value,
                    password: this.passwordInputElement.value,
                    rememberMe: this.rememberInputElement.checked
                })
            })

            if (loginResult && loginResult.status === 401) {
                alert('Неправильная почта или пароль');
                return;
            }

            if (loginResult && loginResult.status >= 200 && loginResult.status < 300) {
                const result = await loginResult.json();

                Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                Auth.setUserInfo(result.user);

                window.location.href = '#/';
            }
        }
    }
}