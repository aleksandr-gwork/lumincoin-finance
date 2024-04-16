export class Validation {
    constructor() {
        this.form = document.querySelector('.needs-validation');
        this.createButton = document.getElementById('accept-button');

        this.validation();
    }

    validation(){
        this.createButton.addEventListener('click', function (event) {
            if (!this.form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            this.form.classList.add('was-validated');
        }, false);
    }
}



