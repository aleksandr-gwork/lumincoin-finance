export class Validation {
    constructor() {

        this.form = document.querySelector('.needs-validation');
        this.acceptButton = document.getElementById('accept-button');

        this.validationForm();
    }

    validationForm() {
        this.acceptButton.addEventListener('click', function (event) {
            if (!this.form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            this.form.classList.add('was-validated');
        }, false);
    }

    static validationInputs(inputs) {
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value === '') {
                return false;
            }
        }
        return true;
    }
}


