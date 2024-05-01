import config from "../../config/config.js";

export class Registration {
    constructor() {
        this.findInputElements();

        this.acceptButton.addEventListener('click', this.processForm.bind(this));
    }

    findInputElements() {
        this.userNameInputElement = document.getElementById('name');
        this.emailInputElement = document.getElementById('email');
        this.passwordInputElement = document.getElementById('password');
        this.passwordRepeatInputElement = document.getElementById('repeatPassword');
        this.acceptButton = document.getElementById('accept-button');
    }

    validationInputs() {
        let isValid = true;



        this.emailRegExp = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/;
        this.passRegExp = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{7,})\S$/;

        this.form = document.querySelector('form');
        this.formInputs = this.form.querySelectorAll('input');

        this.formInputs.forEach(input => {
            input.classList.remove('is-invalid');
        });

        if (this.userNameInputElement) {
            const userFullName = this.userNameInputElement.value.split(' ');
            if (!(userFullName.length > 1)) {
                this.userNameInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.emailInputElement) {
            if (!(this.emailInputElement.value.match(this.emailRegExp) && this.emailInputElement.value.length > 0)) {
                this.emailInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.passwordInputElement) {
            if (!(this.passwordInputElement.value.match(this.passRegExp))) {
                this.passwordInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.passwordRepeatInputElement) {
            if (!(this.passwordRepeatInputElement.value.match(this.passRegExp) || this.passwordRepeatInputElement.value === this.passwordInputElement.value)) {
                this.passwordRepeatInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        return isValid;
    }

    async processForm() {

        const userFullName = this.userNameInputElement.value.split(' ');

        if (this.validationInputs()) {
            try {
                const registrationResult = await fetch(config.api + '/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: userFullName[1],
                        lastName: userFullName[0],
                        email: this.emailInputElement.value,
                        password: this.passwordInputElement.value,
                        passwordRepeat: this.passwordRepeatInputElement.value
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