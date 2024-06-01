import config from "../../config/config";
import {RegistrationResponse} from "../../types/registration-response.type";
import {AuthResponseError} from "../../types/auth-response-error.type";

export class Registration {
    readonly emailRegExp: RegExp = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/;
    readonly passRegExp: RegExp = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{7,})\S$/;
    readonly acceptButton: HTMLElement | null;
    readonly userNameInputElement: HTMLElement | null;
    readonly emailInputElement: HTMLElement | null;
    readonly passwordInputElement: HTMLElement | null;
    readonly passwordRepeatInputElement: HTMLElement | null;
    readonly form: HTMLFormElement | null;
    private formInputs: NodeListOf<HTMLElement> | undefined;

    constructor() {
        this.form = document.querySelector('form');
        this.userNameInputElement = document.getElementById('name');
        this.emailInputElement = document.getElementById('email');
        this.passwordInputElement = document.getElementById('password');
        this.passwordRepeatInputElement = document.getElementById('repeatPassword');
        this.acceptButton = document.getElementById('accept-button');
        if (this.acceptButton) {
            this.acceptButton.addEventListener('click', this.processForm.bind(this));
        }
    }

    private validationInputs(): boolean {
        let isValid: boolean = true;

        if (this.form) {
            this.formInputs = this.form.querySelectorAll('input');
            this.formInputs.forEach((input: HTMLElement) => {
                input.classList.remove('is-invalid');
            });
        }

        if (this.userNameInputElement) {
            const userFullName: string[] = (this.userNameInputElement as HTMLInputElement).value.split(' ');
            if (!(userFullName.length > 1)) {
                this.userNameInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.emailInputElement) {
            if (!((this.emailInputElement as HTMLInputElement).value.match(this.emailRegExp) && (this.emailInputElement as HTMLInputElement).value.length > 0)) {
                this.emailInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.passwordInputElement) {
            if (!((this.passwordInputElement as HTMLInputElement).value.match(this.passRegExp))) {
                this.passwordInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.passwordRepeatInputElement) {
            if (!((this.passwordRepeatInputElement as HTMLInputElement).value.match(this.passRegExp) || (this.passwordRepeatInputElement as HTMLInputElement).value === (this.passwordInputElement as HTMLInputElement).value)) {
                this.passwordRepeatInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        return isValid;
    }

    async processForm(): Promise<void> {

        const userFullName: string[] = (this.userNameInputElement as HTMLInputElement).value.split(' ');

        if (this.validationInputs()) {
            try {
                const registrationResult: Response = await fetch(config.api + '/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: userFullName[1],
                        lastName: userFullName[0],
                        email: (this.emailInputElement as HTMLInputElement).value,
                        password: (this.passwordInputElement as HTMLInputElement).value,
                        passwordRepeat: (this.passwordRepeatInputElement as HTMLInputElement).value
                    })
                });

                if (registrationResult && (registrationResult.status === 400 || registrationResult.status === 401)) {
                    alert('Неправильная почта или пароль');
                    return;
                }

                if (registrationResult && registrationResult.status >= 200 && registrationResult.status < 300) {
                    const result: RegistrationResponse | AuthResponseError = await registrationResult.json();

                    if (result && 'user' in result) {
                        window.location.href = '#/login';
                    } else {
                        console.log('Error:' + result.message);
                    }
                }

            } catch (e) {
                return console.log('Catch an error:', e);
            }
        }
    }
}