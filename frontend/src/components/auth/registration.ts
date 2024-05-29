import config from "../../config/config";

export class Registration {
    private acceptButton: HTMLElement | null = null;
    private userNameInputElement!: HTMLElement | null;
    private emailInputElement!: HTMLElement | null;
    private passwordInputElement!: HTMLElement | null;
    private passwordRepeatInputElement!: HTMLElement | null;
    private emailRegExp!: RegExp;
    private passRegExp!: RegExp;
    private form!: HTMLFormElement | null;
    private formInputs!: NodeListOf<HTMLElement>;

    constructor() {
        this.findInputElements();

        if (this.acceptButton) {
            this.acceptButton.addEventListener('click', this.processForm.bind(this));
        }
    }

    private findInputElements():void {
        this.userNameInputElement = document.getElementById('name');
        this.emailInputElement = document.getElementById('email');
        this.passwordInputElement = document.getElementById('password');
        this.passwordRepeatInputElement = document.getElementById('repeatPassword');
        this.acceptButton = document.getElementById('accept-button');
    }

    private validationInputs(): boolean {
        let isValid: boolean = true;
        if (!this.form) {
            return false;
        }

        this.emailRegExp = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/;
        this.passRegExp = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{7,})\S$/;

        this.form = document.querySelector('form');
        this.formInputs = this.form!.querySelectorAll('input');

        this.formInputs.forEach((input: HTMLElement) => {
            input.classList.remove('is-invalid');
        });

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
        if (!this.form) {
            return;
        }

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

                if (registrationResult && registrationResult.status === 400) {
                    alert('Такой пользователь уже существует');
                    return;
                }

                if (registrationResult && registrationResult.status === 401) {
                    alert('Неправильная почта или пароль');
                    return;
                }

                if (registrationResult && registrationResult.status >= 200 && registrationResult.status < 300) {
                    const result = await registrationResult.json();

                    if (!result.error) {
                        window.location.href = '#/login';
                    } else {
                        console.log('Error:' + result.message);
                    }
                } //TODO: Сделать обработку ошибок при регистрации

            } catch (e) {
                return console.log('Catch an error:', e);
            }
        }
    }
}