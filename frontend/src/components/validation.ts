export class Validation {
    readonly acceptButton: HTMLElement | null;
    readonly form: HTMLFormElement | null;

    constructor() {
        this.form = document.querySelector('.needs-validation');
        this.acceptButton = document.getElementById('accept-button');

        this.validationForm();
    }

    private validationForm(): void {
        if (this.acceptButton) {
            this.acceptButton.addEventListener('click', (event: Event) => {
                if (this.form) {
                    if (!this.form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    this.form.classList.add('was-validated');
                }
            }, false);
        }
    }
}


